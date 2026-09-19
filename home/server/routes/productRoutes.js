// server/routes/productRoutes.js
const express = require('express');
const Product = require('../models/products');
const Category = require('../models/Category');
const { authMiddleware, adminMiddleware } = require('./authRoutes');
const router = express.Router();

// @route   GET /api/products
// @desc    Get all products with search, filter, sort & category
router.get('/', async (req, res) => {
    try {
        const { search, category, minPrice, maxPrice, rating, inStock, sort, isSpecial, isFeatured } = req.query;
        let query = {};

        // 1. Search by name, description or category
        if (search && search.trim() !== '') {
            const searchRegex = new RegExp(search.trim(), 'i');
            query.$or = [
                { name: searchRegex },
                { description: searchRegex },
                { category: searchRegex },
                { ingredients: searchRegex }
            ];
        }

        // 2. Filter by Category
        if (category && category !== 'All' && category.trim() !== '') {
            // Match category name case-insensitively or slug
            if (category.toLowerCase() === 'chips' || category.toLowerCase() === 'chip') {
                query.category = new RegExp('^Chips$', 'i');
            } else if (category.toLowerCase() === 'namkeen') {
                query.category = new RegExp('^Namkeen$', 'i');
            } else if (category.toLowerCase() === 'corn' || category.toLowerCase() === 'corn snacks') {
                query.category = new RegExp('^Corn Snacks$', 'i');
            } else if (category.toLowerCase() === 'chakli') {
                query.category = new RegExp('^Chakli$', 'i');
            } else if (category.toLowerCase() === 'combos' || category.toLowerCase() === 'special combos') {
                query.category = new RegExp('^Special Combos$', 'i');
            } else {
                query.category = new RegExp(category, 'i');
            }
        }

        // 3. Filter by Price Range
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        // 4. Filter by Rating
        if (rating) {
            query.rating = { $gte: Number(rating) };
        }

        // 5. Filter by Stock Availability
        if (inStock === 'true') {
            query.stock = { $gt: 0 };
        }

        // 6. Featured / Special Flags
        if (isSpecial === 'true') {
            query.isSpecial = true;
        }
        if (isFeatured === 'true') {
            query.isFeatured = true;
        }

        // Build Sort Object
        let sortOption = { createdAt: -1 };
        if (sort === 'price_asc') {
            sortOption = { price: 1 };
        } else if (sort === 'price_desc') {
            sortOption = { price: -1 };
        } else if (sort === 'rating') {
            sortOption = { rating: -1, reviewCount: -1 };
        } else if (sort === 'popular') {
            sortOption = { reviewCount: -1, rating: -1 };
        } else if (sort === 'newest') {
            sortOption = { createdAt: -1 };
        }

        const products = await Product.find(query).sort(sortOption);
        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/products/categories
// @desc    Get all distinct categories with counts
router.get('/meta/categories', async (req, res) => {
    try {
        const categories = await Product.aggregate([
            { $group: { _id: '$category', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);
        res.json(categories);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @route   GET /api/products/:id
// @desc    Get single product by ID
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   POST /api/products
// @desc    Add a new product (Admin)
router.post('/', async (req, res) => {
    try {
        const { 
            name, price, discountPrice, category, image, description, 
            stock, lowStockThreshold, ingredients, prepTime, isSpecial, isFeatured 
        } = req.body;

        if (!name || price === undefined || !category) {
            return res.status(400).json({ message: 'Name, price and category are required' });
        }

        const newProduct = new Product({
            name,
            price: Number(price),
            discountPrice: discountPrice ? Number(discountPrice) : 0,
            category,
            image: image || '/photo/products1.webp',
            description: description || 'Crispy, freshly prepared authentic snack.',
            stock: stock !== undefined ? Number(stock) : 20,
            lowStockThreshold: lowStockThreshold !== undefined ? Number(lowStockThreshold) : 5,
            ingredients: Array.isArray(ingredients) ? ingredients : (ingredients ? ingredients.split(',').map(s => s.trim()) : []),
            prepTime: prepTime || 'Freshly Packed',
            isSpecial: Boolean(isSpecial),
            isFeatured: Boolean(isFeatured)
        });

        await newProduct.save();

        // Update category item count
        await Category.findOneAndUpdate({ name: category }, { $inc: { itemCount: 1 } });

        res.status(201).json(newProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @route   PUT /api/products/:id
// @desc    Update an existing product (Admin)
router.put('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        const { 
            name, price, discountPrice, category, image, description, 
            stock, lowStockThreshold, ingredients, prepTime, isSpecial, isFeatured 
        } = req.body;

        if (name) product.name = name;
        if (price !== undefined) product.price = Number(price);
        if (discountPrice !== undefined) product.discountPrice = Number(discountPrice);
        if (category) product.category = category;
        if (image) product.image = image;
        if (description) product.description = description;
        if (stock !== undefined) product.stock = Number(stock);
        if (lowStockThreshold !== undefined) product.lowStockThreshold = Number(lowStockThreshold);
        if (ingredients !== undefined) {
            product.ingredients = Array.isArray(ingredients) ? ingredients : ingredients.split(',').map(s => s.trim());
        }
        if (prepTime) product.prepTime = prepTime;
        if (isSpecial !== undefined) product.isSpecial = Boolean(isSpecial);
        if (isFeatured !== undefined) product.isFeatured = Boolean(isFeatured);

        await product.save();
        res.json(product);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @route   DELETE /api/products/:id
// @desc    Delete a product (Admin)
router.delete('/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        // Decrement category count
        await Category.findOneAndUpdate({ name: product.category }, { $inc: { itemCount: -1 } });

        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   POST /api/products/seed-now
// @desc    Trigger fresh database seed on demand
router.post('/seed-now', async (req, res) => {
    try {
        const { seedDatabase } = require('../seedData');
        await seedDatabase();
        res.json({ success: true, message: 'Database seeded successfully with authentic snacks!' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error seeding database', error: err.message });
    }
});

module.exports = router;
