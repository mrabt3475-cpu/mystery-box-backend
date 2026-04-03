const express = require('express');
const router = express.Router();
const User = require('../models/user.model');
const { auth } = require('../middleware/auth.middleware');

// Search users
router.get('/search', auth, async (req, res) => {
  try {
    const { username } = req.query;
    const users = await User.find({ username: { $regex: username, $options: 'i' }, _id: { $ne: req.user.id } }).select('name username avatar').limit(10);
    res.json({ success: true, data: users[0] || null });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get user by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('name username avatar');
    if (!user) return res.status(404).json({ success: false, error: 'المستخدم غير موجود' });
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
