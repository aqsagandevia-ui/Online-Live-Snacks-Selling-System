const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    description: { type: String, default: '' },
    discountType: { type: String, enum: ['percent', 'flat'], default: 'percent' },
    discountValue: { type: Number, required: true, min: 1 },
    minOrderValue: { type: Number, default: 0 },
    maxDiscount: { type: Number, default: 500 },
    expiryDate: { type: Date, default: () => new Date(+new Date() + 365*24*60*60*1000) },
    usageLimit: { type: Number, default: 100 },
    usedCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Coupon', couponSchema);
