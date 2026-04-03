// Auth Controller
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User.model');
const { asyncHandler } = require('../middleware/error.middleware');
const config = require('../config/env');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRE,
  });
};

// Generate Refresh Token
const generateRefreshToken = (id) => {
  return jwt.sign({ id }, config.JWT_REFRESH_SECRET, {
    expiresIn: config.JWT_REFRESH_EXPIRE,
  });
};

// @desc    Register new user
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res) => {
  const { name, email, password, referralCode } = req.body;

  // Check if user exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: 'Email already registered',
    });
  }

  // Check referral
  let referredBy = null;
  if (referralCode) {
    referredBy = await User.findOne({ referralCode });
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    referredBy: referredBy?._id,
  });

  // Generate tokens
  const token = generateToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  // Update referrer stats
  if (referredBy) {
    await User.findByIdAndUpdate(referredBy._id, {
      $inc: { 'stats.referralsCount': 1 },
    });
  }

  res.status(201).json({
    success: true,
    message: 'Registration successful',
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
      token,
      refreshToken,
    },
  });
});

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check if user exists
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials',
    });
  }

  // Check if user is active
  if (user.status === 'banned') {
    return res.status(403).json({
      success: false,
      message: 'Your account has been banned',
    });
  }

  // Check password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials',
    });
  }

  // Update last login
  user.lastLogin = new Date();
  await user.save();

  // Generate tokens
  const token = generateToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  res.json({
    success: true,
    message: 'Login successful',
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
      token,
      refreshToken,
    },
  });
});

// @desc    Logout user
// @route   POST /api/v1/auth/logout
// @access  Private
exports.logout = asyncHandler(async (req, res) => {
  // In a real app, you'd invalidate the token in Redis
  res.json({
    success: true,
    message: 'Logout successful',
  });
});

// @desc    Get current user
// @route   GET /api/v1/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

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
        stats: user.stats,
        settings: user.settings,
        referralCode: user.referralCode,
      },
    },
  });
});

// @desc    Update user profile
// @route   PUT /api/v1/auth/updateProfile
// @access  Private
exports.updateProfile = asyncHandler(async (req, res) => {
  const { name, email, avatar } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { name, email, avatar },
    { new: true, runValidators: true }
  );

  res.json({
    success: true,
    message: 'Profile updated successfully',
    data: { user },
  });
});

// @desc    Update password
// @route   PUT /api/v1/auth/updatePassword
// @access  Private
exports.updatePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user.id).select('+password');

  // Check current password
  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: 'Current password is incorrect',
    });
  }

  user.password = newPassword;
  await user.save();

  res.json({
    success: true,
    message: 'Password updated successfully',
  });
});

// @desc    Forgot password
// @route   POST /api/v1/auth/forgotPassword
// @access  Public
exports.forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.json({
      success: true,
      message: 'If the email exists, a reset link will be sent',
    });
  }

  // Generate reset token
  const resetToken = crypto.randomBytes(20).toString('hex');
  user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
  await user.save();

  // In a real app, send email here
  res.json({
    success: true,
    message: 'If the email exists, a reset link will be sent',
  });
});

// @desc    Reset password
// @route   PUT /api/v1/auth/resetPassword/:token
// @access  Public
exports.resetPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;

  const user = await User.findOne({
    resetPasswordToken: crypto.createHash('sha256').update(req.params.token).digest('hex'),
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({
      success: false,
      message: 'Invalid or expired reset token',
    });
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  res.json({
    success: true,
    message: 'Password reset successful',
  });
});

// @desc    Verify email
// @route   POST /api/v1/auth/verifyEmail/:token
// @access  Public
exports.verifyEmail = asyncHandler(async (req, res) => {
  // Implementation depends on your verification flow
  res.json({
    success: true,
    message: 'Email verified successfully',
  });
});

// @desc    Refresh token
// @route   GET /api/v1/auth/refresh-token
// @access  Public
exports.refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({
      success: false,
      message: 'Refresh token is required',
    });
  }

  try {
    const decoded = jwt.verify(refreshToken, config.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token',
      });
    }

    const newToken = generateToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);

    res.json({
      success: true,
      data: {
        token: newToken,
        refreshToken: newRefreshToken,
      },
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
    });
  }
});
