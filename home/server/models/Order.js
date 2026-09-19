const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    image: { type: String, default: '' },
    category: { type: String, default: '' }
});

const statusTimelineSchema = new mongoose.Schema({
    status: { 
        type: String, 
        enum: ['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled'],
        required: true 
    },
    timestamp: { type: Date, default: Date.now },
    note: { type: String, default: '' }
});

const orderSchema = new mongoose.Schema({
    orderId: { type: String, required: true, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    customerPhone: { type: String, required: true },
    items: [orderItemSchema],
    subtotal: { type: Number, required: true },
    discountAmount: { type: Number, default: 0 },
    couponCode: { type: String, default: '' },
    deliveryFee: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    shippingAddress: {
        fullName: String,
        phone: String,
        street: String,
        city: String,
        state: String,
        pincode: String,
        type: String
    },
    paymentMethod: { 
        type: String, 
        enum: ['cod', 'online_demo', 'upi', 'card'], 
        default: 'cod' 
    },
    paymentStatus: { 
        type: String, 
        enum: ['pending', 'paid', 'failed', 'refunded'], 
        default: 'pending' 
    },
    orderStatus: { 
        type: String, 
        enum: ['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled'], 
        default: 'pending' 
    },
    statusTimeline: [statusTimelineSchema],
    orderNotes: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
