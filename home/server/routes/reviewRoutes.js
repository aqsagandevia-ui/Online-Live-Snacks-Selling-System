const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Product = require('../models/products');

// @route   GET /api/reviews/:productId
// @desc    Get all reviews for a product
router.get('/:productId', async (req, res) => {
    try {
        const reviews = await Review.find({ product: req.params.productId }).sort({ createdAt: -1 });
        res.json({ success: true, count: reviews.length, reviews });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error fetching reviews', error: err.message });
    }
});

// @route   POST /api/reviews
// @desc    Add a review for a product
router.post('/', async (req, res) => {
    try {
        const { product, userId, userName, rating, comment } = req.body;
        if (!product || !rating || !comment) {
            return res.status(400).json({ success: false, message: 'Product, rating (1-5), and comment are required' });
        }

        const newReview = new Review({
            product,
            user: userId || null,
            userName: userName || 'Satisfied Customer',
            rating: Number(rating),
            comment
        });

        await newReview.save();

        // Recalculate average rating & review count for product
        const allReviews = await Review.find({ product });
        const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

        await Product.findByIdAndUpdate(product, {
            rating: Number(avgRating.toFixed(1)),
            reviewCount: allReviews.length
        });

        res.status(201).json({ success: true, message: 'Thank you for your review!', review: newReview });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error submitting review', error: err.message });
    }
});

module.exports = router;
