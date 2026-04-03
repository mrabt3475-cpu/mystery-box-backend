const express = require('express');
const router = express.Router();
const User = require('../models/user.model');
const PointsTransaction = require('../models/pointsTransaction.model');
const { auth } = require('../middleware/auth.middleware');
const { catchAsync } = require('../middleware/errorHandler.middleware');
const { NotFoundError, ValidationError } = require('../utils/AppError');
const { formatSuccess } = require('../utils/responseFormatter');

// Get user's points with transactions
router.get('/', auth, catchAsync(async (req, res) => {
  const user = await User.findById(req.user.id).select('pointsBalance lifetimePoints');
  
  if (!user) {
    throw new NotFoundError('المستخدم');
  }
  
  const transactions = await PointsTransaction.find({ user: req.user.id })
    .sort({ createdAt: -1 })
    .limit(50);
  
  res.json(formatSuccess({
    balance: user.pointsBalance,
    lifetime: user.lifetimePoints,
    transactions
  }));
}));

// Add points (Admin only)
router.post('/add', auth, catchAsync(async (req, res) => {
  if (req.user.role !== 'admin') {
    throw new ValidationError('غير مصرح لك');
  }
  
  const { userId, amount, type, description } = req.body;
  
  if (!userId || !amount || amount <= 0) {
    throw new ValidationError('بيانات غير صالحة');
  }
  
  const user = await User.findById(userId);
  if (!user) {
    throw new NotFoundError('المستخدم');
  }

  user.pointsBalance += amount;
  user.lifetimePoints += amount;
  await user.save();

  await PointsTransaction.create({
    user: userId,
    amount,
    type: type || 'admin_bonus',
    description: description || 'إضافة نقاط من الإدارة',
    balanceAfter: user.pointsBalance
  });

  res.json(formatSuccess({ newBalance: user.pointsBalance }, '✅ تم إضافة النقاط'));
}));

// Deduct points (Admin only)
router.post('/deduct', auth, catchAsync(async (req, res) => {
  if (req.user.role !== 'admin') {
    throw new ValidationError('غير مصرح لك');
  }
  
  const { userId, amount, reason } = req.body;
  
  if (!userId || !amount || amount <= 0) {
    throw new ValidationError('بيانات غير صالحة');
  }
  
  const user = await User.findById(userId);
  if (!user) {
    throw new NotFoundError('المستخدم');
  }
  
  if (user.pointsBalance < amount) {
    throw new ValidationError('رصيد المستخدم غير كافٍ');
  }

  user.pointsBalance -= amount;
  await user.save();

  await PointsTransaction.create({
    user: userId,
    amount: -amount,
    type: 'admin_deduction',
    description: reason || 'خصم نقاط من الإدارة',
    balanceAfter: user.pointsBalance
  });

  res.json(formatSuccess({ newBalance: user.pointsBalance }, '✅ تم خصم النقاط'));
}));

module.exports = router;
