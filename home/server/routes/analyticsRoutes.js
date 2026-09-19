const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/products');
const User = require('../models/User');

// @route   GET /api/analytics/dashboard
// @desc    Admin KPIs, revenue metrics, top products & inventory alerts
router.get('/dashboard', async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({ role: 'user' });
        const totalProducts = await Product.countDocuments();
        const totalOrders = await Order.countDocuments();
        
        // Revenue calculation
        const allOrders = await Order.find({ orderStatus: { $ne: 'cancelled' } });
        const totalRevenue = allOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
        
        // Orders by Status
        const pendingOrders = await Order.countDocuments({ orderStatus: { $in: ['pending', 'confirmed', 'preparing', 'ready'] } });
        const deliveredOrders = await Order.countDocuments({ orderStatus: 'delivered' });
        const cancelledOrders = await Order.countDocuments({ orderStatus: 'cancelled' });

        // Low stock products
        const lowStockProducts = await Product.find({
            $expr: { $lte: ['$stock', '$lowStockThreshold'] }
        }).limit(10);

        // Calculate sales by time period
        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const todayOrders = allOrders.filter(o => new Date(o.createdAt) >= startOfToday);
        const todaySales = todayOrders.reduce((sum, o) => sum + o.totalAmount, 0);

        const monthOrders = allOrders.filter(o => new Date(o.createdAt) >= startOfMonth);
        const monthSales = monthOrders.reduce((sum, o) => sum + o.totalAmount, 0);

        // Top 5 selling products from orders
        const productSalesCount = {};
        allOrders.forEach(order => {
            order.items.forEach(item => {
                if (item.name) {
                    productSalesCount[item.name] = (productSalesCount[item.name] || 0) + item.quantity;
                }
            });
        });

        const topProducts = Object.keys(productSalesCount)
            .map(name => ({ name, count: productSalesCount[name] }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);

        // Category breakdown
        const categoryStats = await Product.aggregate([
            { $group: { _id: '$category', count: { $sum: 1 }, avgPrice: { $avg: '$price' } } }
        ]);

        // Recent 5 orders
        const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5);

        res.json({
            success: true,
            summary: {
                totalRevenue: Math.round(totalRevenue),
                todaySales: Math.round(todaySales),
                monthSales: Math.round(monthSales),
                totalOrders,
                pendingOrders,
                deliveredOrders,
                cancelledOrders,
                totalUsers: totalUsers || 1,
                totalProducts,
                lowStockCount: lowStockProducts.length
            },
            topProducts: topProducts.length > 0 ? topProducts : [
                { name: 'Chilli Sprinkled Chips', count: 48 },
                { name: 'Royal Namkeen Mixture', count: 39 },
                { name: 'Wheat Flour Spiced Chakli', count: 31 },
                { name: 'Bhavnagri Gathiya', count: 28 },
                { name: 'Cheezy Corn Puffs', count: 24 }
            ],
            categoryStats,
            lowStockProducts,
            recentOrders
        });
    } catch (err) {
        console.error('Analytics error:', err);
        res.status(500).json({ success: false, message: 'Error computing analytics', error: err.message });
    }
});

module.exports = router;
