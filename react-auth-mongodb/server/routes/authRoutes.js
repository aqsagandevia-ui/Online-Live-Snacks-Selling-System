const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = express.Router();
const JWT_SECRET = 'your_jwt_secret';

// Registration Route
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).send('User already exists.');

    const user = new User({ name, email, password });
    await user.save();
    res.status(201).send('User registered successfully');
  } catch (error) {
    res.status(500).send('Error registering user');
  }
});

// Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).send('Invalid email or password.');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(400).send('Invalid email or password.');

    const token = jwt.sign({ userId: user._id }, JWT_SECRET);
    res.status(200).json({ token, message: 'Login successful' });
  } catch (error) {
    res.status(500).send('Error logging in');
  }
});

module.exports = router;
