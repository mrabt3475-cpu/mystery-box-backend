const express = require('express');
const router = express.Router();
const PointsTransaction = require('../models/pointsTransaction.model');
const User = require('../models/user.model');
const { auth, requireRole } = require('../middleware/auth.middleware');
const { pointsLimiter } = require('../middleware/rateLimiter.middleware');
const { catchAsync } = require('../utils/errorHandler');
const { NotFoundError, ValidationError } = require('../utils/errors');
const mongoose = require('mongoose');

// Get user's points with transactions
router.get('/', auth, catchAsync(async (req, res) => {
  const user = await User.findById(req.user.id).select('pointsBalance lifetimePoints');
  
  if (!user) {
    throw new NotFoundError('المستخدم');
  }
  
  const transactions = await PointsTransaction.find({ user: req.user.id })
    .sort({ createdAt: -1 })
    .limit(50);
  
  res.json({ 
    success: true, 
    data: { 
      balance: user.pointsBalance, 
      lifetime: user.lifetimePoints, 
      transactions 
    } 
  });
}));

// Add points (Admin only) - with rate limiting
router.post('/add', auth, requireRole('admin'), pointsLimiter, catchAsync(async (req, res) => {
  const { userId, amount, type, description } = req.body;
  
  // Validate userId
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new ValidationError('معرف المستخدم غير صالح');
  }
  
  if (amount < 1) {
    throw new ValidationError('المبلغ يجب أن يكون 1 على الأقل');
  }
  
  const user = await User.findById(userId);
  
  if (!user) {
    throw new NotFoundError('المستخدم');
  }

  // Atomic update
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

  res.json({ success: true, data: { newBalance: user.pointsBalance } });
}));

// Deduct points (Admin only)
router.post('/deduct', auth, requireRole('admin'), pointsLimiter, catchAsync(async (req, res) => {
  const { userId, amount, reason } = req.body;
  
  // Validate userId
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new ValidationError('معرف المستخدم غير صالح');
  }
  
  if (amount < 1) {
    throw new ValidationError('المبلغ يجب أن يكون 1 على الأقل');
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

  res.json({ success: true, data: { newBalance: user.pointsBalance } });
}));

module.exports = router;
