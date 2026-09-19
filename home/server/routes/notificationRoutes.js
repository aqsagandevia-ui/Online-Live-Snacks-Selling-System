const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');

// @route   GET /api/notifications
// @desc    Get notifications for user or admin
router.get('/', async (req, res) => {
    try {
        const { role, userId } = req.query;
        let query = { $or: [{ recipient: 'all' }] };

        if (role === 'admin') {
            query.$or.push({ recipient: 'admin' });
        }
        if (userId) {
            query.$or.push({ recipient: userId });
        }

        const notifications = await Notification.find(query).sort({ createdAt: -1 }).limit(20);
        res.json({ success: true, count: notifications.length, notifications });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error fetching notifications', error: err.message });
    }
});

// @route   PUT /api/notifications/:id/read
// @desc    Mark notification as read
router.put('/:id/read', async (req, res) => {
    try {
        await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
        res.json({ success: true, message: 'Notification marked as read' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error updating notification', error: err.message });
    }
});

module.exports = router;
