const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'crunchybite_jwt_secret_key_mca_2026';

// Middleware for verifying JWT
const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, message: 'Authorization token missing' });
        }
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
            return res.status(401).json({ success: false, message: 'User not found' });
        }
        req.user = user;
        next();
    } catch (err) {
        return res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }
};

// Middleware for Admin check
const adminMiddleware = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Admin access required' });
    }
    next();
};

// @route   POST /api/auth/register
// @desc    Register a new customer
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: 'Please provide name, email, and password.' });
        }

        const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
        }

        const newUser = new User({
            name,
            email: email.toLowerCase().trim(),
            password,
            phone: phone || '',
            role: 'user'
        });

        await newUser.save();

        const token = jwt.sign({ id: newUser._id, role: newUser.role }, JWT_SECRET, { expiresIn: '7d' });

        res.status(201).json({
            success: true,
            message: 'Registration successful!',
            token,
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                phone: newUser.phone,
                role: newUser.role,
                addresses: newUser.addresses
            }
        });
    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({ success: false, message: 'Server error during registration', error: err.message });
    }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token (supports Admin Aqsa & regular users)
router.post('/login', async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const loginIdentifier = (email || username || '').trim();

        if (!loginIdentifier || !password) {
            return res.status(400).json({ success: false, message: 'Please provide email/username and password.' });
        }

        // Check for legacy/hardcoded viva admin credential shortcut
        if ((loginIdentifier.toLowerCase() === 'aqsa' || loginIdentifier.toLowerCase() === 'admin@crunchybite.com') && 
            (password === 'aqsa1234' || password === 'admin123')) {
            let admin = await User.findOne({ email: 'admin@crunchybite.com' });
            if (!admin) {
                admin = await User.create({
                    name: 'Aqsa Gandevia (Admin)',
                    email: 'admin@crunchybite.com',
                    password: 'admin123',
                    phone: '9876543210',
                    role: 'admin'
                });
            }
            const token = jwt.sign({ id: admin._id, role: admin.role }, JWT_SECRET, { expiresIn: '7d' });
            return res.json({
                success: true,
                message: 'Admin login successful!',
                token,
                user: {
                    id: admin._id,
                    name: admin.name,
                    email: admin.email,
                    phone: admin.phone,
                    role: 'admin',
                    addresses: admin.addresses
                }
            });
        }

        // Normal login lookup by email or name
        const user = await User.findOne({
            $or: [
                { email: loginIdentifier.toLowerCase() },
                { name: new RegExp(`^${loginIdentifier}$`, 'i') }
            ]
        });

        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid credentials. User not found.' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Incorrect password. Please try again.' });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

        res.json({
            success: true,
            message: 'Login successful!',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                addresses: user.addresses
            }
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ success: false, message: 'Server error during login', error: err.message });
    }
});

// @route   GET /api/auth/me
// @desc    Get currently logged in user profile
router.get('/me', authMiddleware, async (req, res) => {
    res.json({
        success: true,
        user: req.user
    });
});

// @route   PUT /api/auth/profile
// @desc    Update user profile details
router.put('/profile', authMiddleware, async (req, res) => {
    try {
        const { name, phone } = req.body;
        const user = req.user;
        if (name) user.name = name;
        if (phone !== undefined) user.phone = phone;
        await user.save();

        res.json({
            success: true,
            message: 'Profile updated successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                addresses: user.addresses
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error updating profile', error: err.message });
    }
});

// @route   POST /api/auth/address
// @desc    Add a new shipping address
router.post('/address', authMiddleware, async (req, res) => {
    try {
        const { fullName, phone, street, city, state, pincode, type, isDefault } = req.body;
        if (!fullName || !phone || !street || !city || !pincode) {
            return res.status(400).json({ success: false, message: 'Please fill in all address fields' });
        }

        const user = req.user;
        if (isDefault) {
            user.addresses.forEach(a => { a.isDefault = false; });
        }

        user.addresses.push({
            fullName,
            phone,
            street,
            city,
            state: state || 'Gujarat',
            pincode,
            type: type || 'Home',
            isDefault: isDefault || user.addresses.length === 0
        });

        await user.save();
        res.json({ success: true, message: 'Address saved successfully', addresses: user.addresses });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error saving address', error: err.message });
    }
});

// @route   DELETE /api/auth/address/:addressId
// @desc    Delete a shipping address
router.delete('/address/:addressId', authMiddleware, async (req, res) => {
    try {
        const user = req.user;
        user.addresses = user.addresses.filter(a => a._id.toString() !== req.params.addressId);
        await user.save();
        res.json({ success: true, message: 'Address removed', addresses: user.addresses });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error deleting address', error: err.message });
    }
});

// @route   GET /api/auth/users
// @desc    Admin: get list of all registered users
router.get('/users', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.json({ success: true, count: users.length, users });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error fetching users', error: err.message });
    }
});

module.exports = { router, authMiddleware, adminMiddleware, JWT_SECRET };
