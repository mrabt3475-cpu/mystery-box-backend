// Auth Service - Fixed Version
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const config = require('../config/env');
const crypto = require('crypto');
const { logger } = require('../../../utils/logger');

const generateToken = (userId) => jwt.sign(
  { id: userId },
  config.JWT_SECRET,
  {
    expiresIn: config.JWT_EXPIRE || '7d',
    algorithm: 'HS256'
  }
);

const generateRefreshToken = (userId) => jwt.sign(
  { id: userId, type: 'refresh' },
  config.JWT_REFRESH_SECRET,
  {
    expiresIn: config.JWT_REFRESH_EXPIRE || '30d',
    algorithm: 'HS256'
  }
);

exports.register = async ({ name, email, password, referralCode }) => {
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) throw new Error('Email already registered');

    let referredBy = null;
    if (referralCode) {
      const referrer = await User.findOne({ referralCode });
      if (referrer) referredBy = referrer._id;
    }

    const user = await User.create({ name, email, password, referredBy });
    user.generateReferralCode();
    await user.save();

    logger.info(`New user registered: ${user._id}`);

    return {
      user,
      token: generateToken(user._id),
      refreshToken: generateRefreshToken(user._id)
    };
  } catch (error) {
    logger.error(`Registration error: ${error.message}`);
    throw error;
  }
};

exports.login = async ({ email, password }) => {
  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) throw new Error('Invalid credentials');

    const isMatch = await user.comparePassword(password);
    if (!isMatch) throw new Error('Invalid credentials');

    user.lastLogin = new Date();
    user.loginCount += 1;
    await user.save();

    logger.info(`User logged in: ${user._id}`);

    return {
      user,
      token: generateToken(user._id),
      refreshToken: generateRefreshToken(user._id)
    };
  } catch (error) {
    logger.error(`Login error: ${error.message}`);
    throw error;
  }
};

exports.getMe = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');
    return user;
  } catch (error) {
    logger.error(`GetMe error: ${error.message}`);
    throw error;
  }
};

exports.updatePassword = async (userId, currentPassword, newPassword) => {
  try {
    const user = await User.findById(userId).select('+password');
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) throw new Error('Current password is incorrect');

    user.password = newPassword;
    await user.save();

    logger.info(`Password updated for user: ${userId}`);

    return { message: 'Password updated successfully' };
  } catch (error) {
    logger.error(`Update password error: ${error.message}`);
    throw error;
  }
};

exports.forgotPassword = async (email) => {
  try {
    const user = await User.findOne({ email });
    if (!user) throw new Error('no user found with this email');

    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
    await user.save();

    logger.info(`Password reset requested for: ${email}`);

    return { resetToken };
  } catch (error) {
    logger.error(`Forgot password error: ${error.message}`);
    throw error;
  }
};

exports.resetPassword = async (token, password) => {
  try {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) throw new Error('Invalid or expired token');

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    logger.info(`Password reset successful for user: ${user._id}`);

    return { message: 'Password reset successfully' };
  } catch (error) {
    logger.error(`Reset password error: ${error.message}`);
    throw error;
  }
};

exports.verifyToken = async (token) => {
  try {
    const decoded = jwt.verify(token, config.JWT_SECRET, {
      algorithms: ['HS256']
    });
    return decoded;
  } catch (error) {
    logger.error(`Token verification error: ${error.message}`);
    throw error;
  }
};

exports.refreshAccessToken = async (refreshToken) => {
  try {
    const decoded = jwt.verify(refreshToken, config.JWT_REFRESH_SECRET, {
      algorithms: ['HS256']
    });

    if (decoded.type !== 'refresh') {
      throw new Error('Invalid token type');
    }

    const user = await User.findById(decoded.id);
    if (!user) throw new Error('User not found');

    return {
      token: generateToken(user._id),
      refreshToken: generateRefreshToken(user._id)
    };
  } catch (error) {
    logger.error(`Refresh token error: ${error.message}`);
    throw error;
  }
};

module.exports = { ...exports, generateToken, generateRefreshToken };