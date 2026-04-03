// User Controller
const User = require('../models/User.model');
const { asyncHandler, AppError } = require('../middleware/error.middleware');

// @desc    Get user profile
// @route   GET /api/v1/users/profile/:id
// @access  Public
const getUserProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id).select('name avatar stats createdAt');

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  res.json({
    success: true,
    data: user,
  });
});

// @desc    Update user settings
// @route   PUT /api/v1/users/settings
// @access  Private
const updateSettings = asyncHandler(async (req, res, next) => {
  const { notifications, language, theme } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user.id,
    {
      'settings.notifications': notifications,
      'settings.language': language,
      'settings.theme': theme,
    },
    { new: true }
  );

  res.json({
    success: true,
    data: user.settings,
  });
});

// @desc    Get user stats
// @route   GET /api/v1/users/stats
// @access  Private
const getUserStats = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.json({
    success: true,
    data: {
      totalOrders: user.stats.totalOrders,
      totalSpent: user.stats.totalSpent,
      referralsCount: user.stats.referralsCount,
      walletBalance: user.wallet.balance,
      points: user.wallet.points,
    },
  });
});

// @desc    Get leaderboard
// @route   GET /api/v1/users/leaderboard
// @access  Public
const getLeaderboard = asyncHandler(async (req, res, next) => {
  const { limit = 10 } = req.query;

  const users = await User.find()
    .select('name avatar stats.totalSpent stats.referralsCount')
    .sort('-stats.totalSpent')
    .limit(parseInt(limit));

  res.json({
    success: true,
    data: users,
  });
});

module.exports = {
  getUserProfile,
  updateSettings,
  getUserStats,
  getLeaderboard,
};
