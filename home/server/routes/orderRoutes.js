const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/products');
const Notification = require('../models/Notification');
const Coupon = require('../models/Coupon');
const { authMiddleware } = require('./authRoutes');

// Helper to generate readable Order ID
const generateOrderId = () => {
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    return `CB-${randomNum}`;
};

// @route   POST /api/orders
// @desc    Create/Place a new snack order
router.post('/', async (req, res) => {
    try {
        const {
            user, customerName, customerEmail, customerPhone,
            items, subtotal, discountAmount, couponCode, deliveryFee, tax, totalAmount,
            shippingAddress, paymentMethod
        } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ success: false, message: 'Your cart is empty' });
        }
        if (!shippingAddress || !customerName || !customerPhone) {
            return res.status(400).json({ success: false, message: 'Please provide full customer & delivery address details' });
        }

        const orderId = generateOrderId();

        // 1. Verify stock & decrement for each item
        for (const item of items) {
            if (item.product || item._id) {
                const prodId = item.product || item._id;
                const prod = await Product.findById(prodId);
                if (prod) {
                    if (prod.stock < item.quantity) {
                        return res.status(400).json({
                            success: false,
                            message: `Insufficient stock for ${prod.name}. Only ${prod.stock} items left.`
                        });
                    }
                    prod.stock = Math.max(0, prod.stock - item.quantity);
                    await prod.save();
                }
            }
        }

        // 2. Increment coupon usage if used
        if (couponCode) {
            await Coupon.findOneAndUpdate({ code: couponCode.toUpperCase() }, { $inc: { usedCount: 1 } });
        }

        // 3. Create initial timeline
        const initialTimeline = [
            {
                status: 'pending',
                timestamp: new Date(),
                note: 'Order placed by customer. Awaiting confirmation.'
            }
        ];

        // 4. Save new order
        const newOrder = new Order({
            orderId,
            user: user || null,
            customerName,
            customerEmail: customerEmail || 'guest@crunchybite.com',
            customerPhone,
            items: items.map(item => ({
                product: item.product || item._id || null,
                name: item.name,
                price: item.discountPrice || item.price,
                quantity: item.quantity,
                image: item.image || item.url || '',
                category: item.category || ''
            })),
            subtotal: Number(subtotal) || 0,
            discountAmount: Number(discountAmount) || 0,
            couponCode: couponCode || '',
            deliveryFee: Number(deliveryFee) || 0,
            tax: Number(tax) || 0,
            totalAmount: Number(totalAmount) || 0,
            shippingAddress,
            paymentMethod: paymentMethod || 'cod',
            paymentStatus: paymentMethod === 'online_demo' || paymentMethod === 'upi' || paymentMethod === 'card' ? 'paid' : 'pending',
            orderStatus: 'pending',
            statusTimeline: initialTimeline
        });

        await newOrder.save();

        // 5. Create notifications for customer & admin
        await Notification.create({
            recipient: 'admin',
            title: `New Order Received #${orderId}`,
            message: `New order of ₹${newOrder.totalAmount} placed by ${customerName}.`,
            type: 'order',
            link: `/admin`
        });

        if (user) {
            await Notification.create({
                recipient: user.toString(),
                title: `Order Placed Successfully #${orderId}`,
                message: `Your snacks are being prepared! You can track live status.`,
                type: 'order',
                link: `/track/${orderId}`
            });
        }

        res.status(201).json({
            success: true,
            message: 'Order placed successfully!',
            order: newOrder
        });
    } catch (err) {
        console.error('Order creation error:', err);
        res.status(500).json({ success: false, message: 'Failed to place order', error: err.message });
    }
});

// @route   GET /api/orders/my-orders
// @desc    Get order history for logged-in user or customer email
router.get('/my-orders', async (req, res) => {
    try {
        const { email, userId } = req.query;
        let filter = {};
        if (userId) {
            filter.user = userId;
        } else if (email) {
            filter.customerEmail = email.toLowerCase();
        } else {
            // Return recent orders if no user specified
            filter = {};
        }

        const orders = await Order.find(filter).sort({ createdAt: -1 });
        res.json({ success: true, count: orders.length, orders });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error fetching orders', error: err.message });
    }
});

// @route   GET /api/orders/:id
// @desc    Track single order by MongoDB _id or orderId (e.g. CB-10021)
router.get('/:id', async (req, res) => {
    try {
        const param = req.params.id;
        let order = null;

        if (param.startsWith('CB-')) {
            order = await Order.findOne({ orderId: param });
        } else if (param.match(/^[0-9a-fA-F]{24}$/)) {
            order = await Order.findById(param);
        } else {
            order = await Order.findOne({ orderId: param });
        }

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        res.json({ success: true, order });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error fetching order details', error: err.message });
    }
});

// @route   GET /api/orders
// @desc    Admin: get all orders with status filter
router.get('/', async (req, res) => {
    try {
        const { status, search } = req.query;
        let filter = {};
        if (status && status !== 'all') {
            filter.orderStatus = status;
        }
        if (search) {
            const regex = new RegExp(search, 'i');
            filter.$or = [
                { orderId: regex },
                { customerName: regex },
                { customerPhone: regex },
                { customerEmail: regex }
            ];
        }

        const orders = await Order.find(filter).sort({ createdAt: -1 });
        res.json({ success: true, count: orders.length, orders });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error fetching orders', error: err.message });
    }
});

// @route   PUT /api/orders/:id/status
// @desc    Admin: Update order status & append to timeline
router.put('/:id/status', async (req, res) => {
    try {
        const { status, note } = req.body;
        const validStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled'];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid order status' });
        }

        let order = await Order.findById(req.params.id);
        if (!order) {
            order = await Order.findOne({ orderId: req.params.id });
        }

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        order.orderStatus = status;
        order.updatedAt = new Date();

        if (status === 'delivered') {
            order.paymentStatus = 'paid';
        }

        // Add to timeline
        order.statusTimeline.push({
            status,
            timestamp: new Date(),
            note: note || `Order status updated to ${status.replace(/_/g, ' ').toUpperCase()}`
        });

        await order.save();

        // Customer notification
        if (order.user) {
            await Notification.create({
                recipient: order.user.toString(),
                title: `Order Update #${order.orderId}`,
                message: `Your order is now: ${status.replace(/_/g, ' ')}.`,
                type: 'order',
                link: `/track/${order.orderId}`
            });
        }

        res.json({ success: true, message: `Order marked as ${status}`, order });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error updating order status', error: err.message });
    }
});

// @route   PUT /api/orders/:id/cancel
// @desc    Customer or Admin cancel order
router.put('/:id/cancel', async (req, res) => {
    try {
        let order = await Order.findById(req.params.id);
        if (!order) {
            order = await Order.findOne({ orderId: req.params.id });
        }

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        if (['delivered', 'cancelled', 'out_for_delivery'].includes(order.orderStatus)) {
            return res.status(400).json({ success: false, message: `Cannot cancel order in '${order.orderStatus}' state` });
        }

        order.orderStatus = 'cancelled';
        order.updatedAt = new Date();
        order.statusTimeline.push({
            status: 'cancelled',
            timestamp: new Date(),
            note: req.body.reason || 'Order cancelled by customer'
        });

        // Restore stock
        for (const item of order.items) {
            if (item.product) {
                await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity } });
            }
        }

        await order.save();

        res.json({ success: true, message: 'Order cancelled successfully and stock restored', order });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error cancelling order', error: err.message });
    }
});

module.exports = router;
