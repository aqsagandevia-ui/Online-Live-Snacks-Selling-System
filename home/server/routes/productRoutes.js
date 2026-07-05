// server/routes/productRoutes.js
const express = require('express');
const Product = require('../models/products');
const router = express.Router();

// Get all products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add a new product
router.post('/', async (req, res) => {
    const { name, price, category } = req.body;
    const newProduct = new Product({ name, price, category });
    try {
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update a product
router.put('/:id', async (req, res) => {
    const { name, price, category } = req.body;
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        product.name = name;
        product.price = price;
        product.category = category;
        await product.save();
        res.json(product);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a product
router.delete('/:id', async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
