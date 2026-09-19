const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const Product = require('../models/products');

// @route   GET /api/categories
// @desc    Get all active categories with dynamic product count
router.get('/', async (req, res) => {
    try {
        const categories = await Category.find({ isActive: true }).sort({ name: 1 });
        // Recalculate item counts
        const enhanced = await Promise.all(categories.map(async (cat) => {
            const count = await Product.countDocuments({
                category: new RegExp(`^${cat.name}$`, 'i')
            });
            const obj = cat.toObject();
            obj.itemCount = count;
            return obj;
        }));
        res.json(enhanced);
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error fetching categories', error: err.message });
    }
});

// @route   POST /api/categories
// @desc    Create new category (Admin)
router.post('/', async (req, res) => {
    try {
        const { name, slug, description, image } = req.body;
        if (!name) return res.status(400).json({ success: false, message: 'Category name is required' });

        const newSlug = slug || name.toLowerCase().replace(/\s+/g, '-');
        const category = new Category({
            name,
            slug: newSlug,
            description: description || '',
            image: image || '/photo/chips1.webp'
        });

        await category.save();
        res.status(201).json({ success: true, category });
    } catch (err) {
        res.status(400).json({ success: false, message: 'Error creating category', error: err.message });
    }
});

// @route   PUT /api/categories/:id
// @desc    Update category (Admin)
router.put('/:id', async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) return res.status(404).json({ success: false, message: 'Category not found' });

        const { name, slug, description, image, isActive } = req.body;
        if (name) category.name = name;
        if (slug) category.slug = slug;
        if (description !== undefined) category.description = description;
        if (image) category.image = image;
        if (isActive !== undefined) category.isActive = isActive;

        await category.save();
        res.json({ success: true, category });
    } catch (err) {
        res.status(400).json({ success: false, message: 'Error updating category', error: err.message });
    }
});

// @route   DELETE /api/categories/:id
// @desc    Delete category (Admin)
router.delete('/:id', async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
        res.json({ success: true, message: 'Category deleted successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error deleting category', error: err.message });
    }
});

module.exports = router;
