const express = require('express');
const router = express.Router();
const Coupon = require('../models/Coupon');

// @route   POST /api/coupons/apply
// @desc    Validate and calculate coupon discount for cart subtotal
router.post('/apply', async (req, res) => {
    try {
        const { code, subtotal } = req.body;
        if (!code) return res.status(400).json({ success: false, message: 'Please enter a coupon code' });

        const coupon = await Coupon.findOne({ code: code.toUpperCase().trim(), isActive: true });
        if (!coupon) {
            return res.status(404).json({ success: false, message: 'Invalid or expired coupon code' });
        }

        // Check expiry
        if (coupon.expiryDate && new Date() > new Date(coupon.expiryDate)) {
            return res.status(400).json({ success: false, message: 'This coupon has expired' });
        }

        // Check usage limit
        if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
            return res.status(400).json({ success: false, message: 'Coupon usage limit has been reached' });
        }

        // Check minimum order value
        const orderValue = Number(subtotal) || 0;
        if (coupon.minOrderValue && orderValue < coupon.minOrderValue) {
            return res.status(400).json({
                success: false,
                message: `Minimum order amount of ₹${coupon.minOrderValue} required for this coupon`
            });
        }

        // Calculate discount
        let discount = 0;
        if (coupon.discountType === 'percent') {
            discount = (orderValue * coupon.discountValue) / 100;
            if (coupon.maxDiscount && discount > coupon.maxDiscount) {
                discount = coupon.maxDiscount;
            }
        } else {
            discount = coupon.discountValue;
        }

        discount = Math.min(discount, orderValue);

        res.json({
            success: true,
            message: `Coupon '${coupon.code}' applied! You saved ₹${discount.toFixed(0)}`,
            coupon: {
                code: coupon.code,
                description: coupon.description,
                discountType: coupon.discountType,
                discountValue: coupon.discountValue,
                discountAmount: Math.round(discount)
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error applying coupon', error: err.message });
    }
});

// @route   GET /api/coupons
// @desc    Get all active coupons for customer display
router.get('/', async (req, res) => {
    try {
        const coupons = await Coupon.find({ isActive: true });
        res.json({ success: true, coupons });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error fetching coupons', error: err.message });
    }
});

// @route   POST /api/coupons
// @desc    Create coupon (Admin)
router.post('/', async (req, res) => {
    try {
        const { code, description, discountType, discountValue, minOrderValue, maxDiscount, expiryDate, usageLimit } = req.body;
        if (!code || !discountValue) {
            return res.status(400).json({ success: false, message: 'Code and discount value are required' });
        }

        const coupon = new Coupon({
            code: code.toUpperCase().trim(),
            description: description || '',
            discountType: discountType || 'percent',
            discountValue: Number(discountValue),
            minOrderValue: Number(minOrderValue) || 0,
            maxDiscount: Number(maxDiscount) || 500,
            expiryDate: expiryDate ? new Date(expiryDate) : new Date(Date.now() + 365*24*60*60*1000),
            usageLimit: Number(usageLimit) || 100
        });

        await coupon.save();
        res.status(201).json({ success: true, message: 'Coupon created successfully', coupon });
    } catch (err) {
        res.status(400).json({ success: false, message: 'Error creating coupon', error: err.message });
    }
});

// @route   PUT /api/coupons/:id
// @desc    Update coupon (Admin)
router.put('/:id', async (req, res) => {
    try {
        const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!coupon) return res.status(404).json({ success: false, message: 'Coupon not found' });
        res.json({ success: true, coupon });
    } catch (err) {
        res.status(400).json({ success: false, message: 'Error updating coupon', error: err.message });
    }
});

// @route   DELETE /api/coupons/:id
// @desc    Delete coupon (Admin)
router.delete('/:id', async (req, res) => {
    try {
        const coupon = await Coupon.findByIdAndDelete(req.params.id);
        if (!coupon) return res.status(404).json({ success: false, message: 'Coupon not found' });
        res.json({ success: true, message: 'Coupon deleted' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error deleting coupon', error: err.message });
    }
});

module.exports = router;
