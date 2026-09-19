const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    recipient: { type: String, default: 'all' }, // userId or 'admin' or 'all'
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, enum: ['order', 'promo', 'stock', 'system'], default: 'order' },
    isRead: { type: Boolean, default: false },
    link: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', notificationSchema);
