// server/app.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const { router: authRoutes } = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const orderRoutes = require('./routes/orderRoutes');
const couponRoutes = require('./routes/couponRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const { seedDatabase } = require('./seedData');
const Product = require('./models/products');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/productsdb';

// Middleware
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/analytics', analyticsRoutes);

// Root Route
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to Crunchy Bite - Online Live Snacks Selling System API',
        status: 'Active',
        timestamp: new Date()
    });
});

// MongoDB connection with auto-seeding
mongoose
    .connect(MONGO_URI)
    .then(async () => {
        console.log('MongoDB connected successfully');
        // Check if database needs initial seeding
        try {
            const count = await Product.countDocuments();
            if (count === 0) {
                console.log('Database empty, running initial seed with 34 authentic snacks...');
                await seedDatabase();
            } else {
                console.log(`Database currently has ${count} snack products ready.`);
            }
        } catch (e) {
            console.log('Seed check note:', e.message);
        }
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err.message);
    });

// Start server
app.listen(PORT, () => {
    console.log(`Crunchy Bite Server is running on http://localhost:${PORT}`);
});

module.exports = app;
