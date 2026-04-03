// Auth Controller
const User = require('../models/User.model');
const { asyncHandler, AppError } = require('../middleware/error.middleware');
const jwt = require('jsonwebtoken');
const config = require('../../config/env');

// Generate Token
const generateToken = (id) => {
  return jwt.sign({ id }, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRE,
  });
};

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
const register = asyncHandler(async (req, res, next) => {
  const { name, email, password, referralCode } = req.body;

  // Check if user exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new AppError('Email already exists', 400));
  }

  // Check referral code
  let referredBy = null;
  if (referralCode) {
    referredBy = await User.findOne({ referralCode });
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    referredBy: referredBy ? referredBy._id : null,
  });

  // Generate tokens
  const token = generateToken(user._id);
  const refreshToken = jwt.sign({ id: user._id }, config.JWT_REFRESH_SECRET, {
    expiresIn: config.JWT_REFRESH_EXPIRE,
  });

  // Update referrer stats
  if (referredBy) {
    await User.findByIdAndUpdate(referredBy._id, {
      $inc: { 'stats.referralsCount': 1 },
    });
  }

  res.status(201).json({
    success: true,
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
      accessToken: token,
      refreshToken,
    },
  });
});

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  // Check for user
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    return next(new AppError('Invalid credentials', 401));
  }

  // Check if user is active
  if (user.status === 'banned') {
    return next(new AppError('Your account has been banned', 403));
  }

  // Update last login
  user.lastLogin = new Date();
  await user.save();

  // Generate tokens
  const token = generateToken(user._id);
  const refreshToken = jwt.sign({ id: user._id }, config.JWT_REFRESH_SECRET, {
    expiresIn: config.JWT_REFRESH_EXPIRE,
  });

  res.json({
    success: true,
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        subscription: user.subscription,
        wallet: user.wallet,
      },
      accessToken: token,
      refreshToken,
    },
  });
});

// @desc    Get current logged in user
// @route   GET /api/v1/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.json({
    success: true,
    data: user,
  });
});

// @desc    Update user profile
// @route   PUT /api/v1/auth/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res, next) => {
  const { name, email, avatar } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { name, email, avatar },
    { new: true, runValidators: true }
  );

  res.json({
    success: true,
    data: user,
  });
});

// @desc    Change password
// @route   PUT /api/v1/auth/password
// @access  Private
const changePassword = asyncHandler(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user.id).select('+password');

  if (!(await user.comparePassword(currentPassword))) {
    return next(new AppError('Current password is incorrect', 401));
  }

  user.password = newPassword;
  await user.save();

  res.json({
    success: true,
    message: 'Password updated successfully',
  });
});

// @desc    Refresh token
// @route   POST /api/v1/auth/refresh
// @access  Public
const refreshToken = asyncHandler(async (req, res, next) => {
  const { refreshToken: token } = req.body;

  if (!token) {
    return next(new AppError('No refresh token provided', 401));
  }

  try {
    const decoded = jwt.verify(token, config.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return next(new AppError('User not found', 404));
    }

    const newToken = generateToken(user._id);
    const newRefreshToken = jwt.sign({ id: user._id }, config.JWT_REFRESH_SECRET, {
      expiresIn: config.JWT_REFRESH_EXPIRE,
    });

    res.json({
      success: true,
      data: {
        accessToken: newToken,
        refreshToken: newRefreshToken,
      },
    });
  } catch (error) {
    return next(new AppError('Invalid refresh token', 401));
  }
});

module.exports = {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  refreshToken,
};
