const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const Notification = require('../models/Notification');
const validateObjectId = require('../middleware/validateObjectId');

// GET /api/notifications - Get notifications for the authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const notifications = await Notification.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('sourceUser', 'username')
      .populate('sourcePost', 'title')
      .populate('sourceComment', 'body')
      .populate('sourceCommunity', 'name');

    const totalNotifications = await Notification.countDocuments({ user: req.user._id });
    const totalPages = Math.ceil(totalNotifications / limit);

    res.status(200).json({
      success: true,
      data: notifications,
      page,
      totalPages,
      error: null,
    });
  } catch (err) {
    res.status(500).json({ success: false, data: null, error: err.message });
  }
});

// PATCH /api/notifications/:id/read - Mark a notification as read
router.patch('/:id/read', auth, validateObjectId('id'), async (req, res) => {
    try {
        const notification = await Notification.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id },
            { read: true },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({ success: false, data: null, error: 'Notification not found' });
        }

        res.status(200).json({ success: true, data: notification, error: null });
    } catch (err) {
        res.status(500).json({ success: false, data: null, error: err.message });
    }
});

module.exports = router;