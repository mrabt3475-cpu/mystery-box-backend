const express = require('express');
const router = express.Router();
const Order = require('../models/Order.model');
const { auth } = require('../middleware/auth.middleware');

// Get user's orders
router.get('/my', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).populate('items.product').sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get order by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user.id }).populate('items.product');
    if (!order) return res.status(404).json({ success: false, error: 'الطلب غير موجود' });
    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Admin: Get all orders
router.get('/admin/all', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ success: false, error: 'غير مصرح' });
    const { page = 1, limit = 20, status } = req.query;
    const query = status ? { status } : {};

    const orders = await Order.find(query).populate('user', 'name email username').populate('items.product').sort({ createdAt: -1 }).skip((page - 1) * limit).limit(parseInt(limit));
    const total = await Order.countDocuments(query);
    res.json({ success: true, data: { orders, pagination: { page: parseInt(page), limit: parseInt(limit), total, totalPages: Math.ceil(total / limit) } } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Admin: Update order status
router.put('/admin/:id/status', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ success: false, error: 'غير مصرح' });
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true }).populate('user', 'name email');
    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
