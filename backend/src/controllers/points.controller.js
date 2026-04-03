// Points Controller - SECURE VERSION
const User = require('../models/User.model');
const { asyncHandler, AppError } = require('../middleware/error.middleware');

// @desc    Add points to user (Admin only - FIXED)
// @route   POST /api/v1/points/add
// @access  Private (Admin only)
const addPoints = asyncHandler(async (req, res, next) => {
  // SECURITY FIX: Added admin authorization check
  if (req.user.role !== 'admin' && req.user.role !== 'owner') {
    return next(new AppError('Admin access required', 403));
  }

  const { userId, amount, reason } = req.body;

  if (!userId || !amount || amount <= 0) {
    return next(new AppError('Valid userId and amount required', 400));
  }

  // Limit max points added at once
  if (amount > 100000) {
    return next(new AppError('Maximum 100,000 points per transaction', 400));
  }

  const user = await User.findById(userId);
  if (!user) {
    return next(new AppError('User not found', 404));
  }

  user.wallet.points += amount;
  await user.save();

  res.json({
    success: true,
    message: `Added ${amount} points to user ${user.name}`,
    data: {
      newBalance: user.wallet.points,
    },
  });
});

// @desc    Deduct points from user (Admin only)
// @route   POST /api/v1/points/deduct
// @access  Private (Admin only)
const deductPoints = asyncHandler(async (req, res, next) => {
  // SECURITY FIX: Added admin authorization check
  if (req.user.role !== 'admin' && req.user.role !== 'owner') {
    return next(new AppError('Admin access required', 403));
  }

  const { userId, amount, reason } = req.body;

  if (!userId || !amount || amount <= 0) {
    return next(new AppError('Valid userId and amount required', 400));
  }

  const user = await User.findById(userId);
  if (!user) {
    return next(new AppError('User not found', 404));
  }

  if (user.wallet.points < amount) {
    return next(new AppError('Insufficient points', 400));
  }

  user.wallet.points -= amount;
  await user.save();

  res.json({
    success: true,
    message: `Deducted ${amount} points from user ${user.name}`,
    data: {
      newBalance: user.wallet.points,
    },
  });
});

// @desc    Get user points
// @route   GET /api/v1/points
// @access  Private
const getPoints = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.json({
    success: true,
    data: {
      points: user.wallet.points,
    },
  });
});

module.exports = {
  addPoints,
  deductPoints,
  getPoints,
};
