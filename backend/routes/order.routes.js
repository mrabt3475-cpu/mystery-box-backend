const express = require('express');
const router = express.Router();
const Order = require('../models/Order.model');
const { auth } = require('../middleware/auth.middleware');
const { catchAsync } = require('../middleware/errorHandler.middleware');
const { NotFoundError, ValidationError } = require('../utils/AppError');
const { formatSuccess } = require('../utils/responseFormatter');

// Get user's orders - WITH PROPER ERROR HANDLING
router.get('/my', auth, catchAsync(async (req, res) => {
  const orders = await Order.find({ user: req.user.id })
    .populate('items.product')
    .sort({ createdAt: -1 });
  
  res.json(formatSuccess(orders));
}));

// Get order by ID
router.get('/:id', auth, catchAsync(async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id, user: req.user.id })
    .populate('items.product');
  
  if (!order) {
    throw new NotFoundError('الطلب');
  }
  
  res.json(formatSuccess(order));
}));

// Admin: Get all orders
router.get('/admin/all', auth, catchAsync(async (req, res) => {
  if (req.user.role !== 'admin') {
    throw new ValidationError('غير مصرح لك');
  }
  
  const { page = 1, limit = 20, status } = req.query;
  const query = status ? { status } : {};

  const orders = await Order.find(query)
    .populate('user', 'name email username')
    .populate('items.product')
    .sort({ createdAt: -1 })
    .skip((parseInt(page) - 1) * parseInt(limit))
    .limit(parseInt(limit));
  
  const total = await Order.countDocuments(query);
  
  res.json(formatSuccess(orders, null, { 
    page: parseInt(page), 
    limit: parseInt(limit), 
    total 
  }));
}));

// Admin: Update order status
router.put('/admin/:id/status', auth, catchAsync(async (req, res) => {
  if (req.user.role !== 'admin') {
    throw new ValidationError('غير مصرح لك');
  }
  
  const { status } = req.body;
  
  const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'];
  if (!status || !validStatuses.includes(status)) {
    throw new ValidationError('حالة غير صالحة');
  }
  
  const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true })
    .populate('user', 'name email');
  
  if (!order) {
    throw new NotFoundError('الطلب');
  }
  
  res.json(formatSuccess(order, '✅ تم تحديث الحالة'));
}));

module.exports = router;