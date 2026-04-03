const express = require('express');
const router = express.Router();
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const authMiddleware = require('../middleware/auth.middleware');
const { catchAsync } = require('../middleware/errorHandler.middleware');
const { validators } = require('../utils/validation');
const { ConflictError, ValidationError, UnauthorizedError } = require('../utils/AppError');
const { formatSuccess } = require('../utils/responseFormatter');
const config = require('../config');
const { logger } = require('../utils/logger');

const generateTokens = (userId) => {
  const accessToken = jwt.sign({ id: userId }, config.jwtSecret, { 
    expiresIn: config.jwtExpire 
  });
  const refreshToken = jwt.sign({ id: userId }, config.jwtRefreshSecret, { 
    expiresIn: config.jwtRefreshExpire 
  });
  return { accessToken, refreshToken };
};

// Register
router.post('/register', validators.register, catchAsync(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ValidationError(errors.array()[0].msg);
  }
  
  const { username, password, name, email, referralCode } = req.body;
  
  // Validate inputs
  if (!username || !password || !name) {
    throw new ValidationError('جميع الحقول مطلوبة');
  }
  
  const existingUser = await User.findOne({ 
    $or: [{ username }, { email: email || null }] 
  });
  
  if (existingUser) {
    throw new ConflictError('المستخدم موجود مسبقاً');
  }

  let referredByUser = null;
  if (referralCode) {
    referredByUser = await User.findOne({ referralCode });
  }

  const user = await User.create({
    username, password, name, email,
    referralCode: Math.random().toString(36).substring(2, 10).toUpperCase(),
    referredBy: referredByUser?._id
  });

  const { accessToken, refreshToken } = generateTokens(user._id);

  if (referredByUser) {
    referredByUser.pointsBalance += 10;
    referredByUser.lifetimePoints += 10;
    await referredByUser.save();
  }

  logger.info(`New user registered: ${username}`);

  res.status(201).json(formatSuccess(
    { user, accessToken, refreshToken },
    '✅ تم التسجيل بنجاح'
  ));
}));

// Login
router.post('/login', validators.login, catchAsync(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ValidationError(errors.array()[0].msg);
  }
  
  const { username, password } = req.body;
  
  const user = await User.findOne({ username });
  if (!user) {
    throw new UnauthorizedError('بيانات الدخول غير صحيحة');
  }

  if (user.isLocked()) {
    throw new UnauthorizedError('الحساب مقفل مؤقتاً، يرجى المحاولة لاحقاً');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    await user.incrementLoginAttempts();
    logger.warn(`Failed login attempt for user: ${username}`);
    throw new UnauthorizedError('بيانات الدخول غير صحيحة');
  }

  await user.resetLoginAttempts();
  user.lastLogin = new Date();
  await user.save();

  const { accessToken, refreshToken } = generateTokens(user._id);
  
  logger.info(`User logged in: ${username}`);
  
  res.json(formatSuccess(
    { user, accessToken, refreshToken },
    '✅ تم تسجيل الدخول بنجاح'
  ));
}));

// Refresh token
router.post('/refresh', catchAsync(async (req, res) => {
  const { refreshToken } = req.body;
  
  if (!refreshToken) {
    throw new ValidationError('Refresh token مطلوب');
  }
  
  const decoded = jwt.verify(refreshToken, config.jwtRefreshSecret);
  
  const user = await User.findById(decoded.id);
  if (!user) {
    throw new UnauthorizedError('Token غير صالح');
  }

  const tokens = generateTokens(user._id);
  res.json(formatSuccess(tokens));
}));

// Get current user
router.get('/me', authMiddleware, catchAsync(async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  res.json(formatSuccess(user));
}));

// Update profile
router.put('/profile', authMiddleware, catchAsync(async (req, res) => {
  const { name, email, avatar, phone, preferences } = req.body;
  
  // Validate email if provided
  if (email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new ValidationError('بريد إلكتروني غير صالح');
    }
  }
  
  const user = await User.findByIdAndUpdate(
    req.user.id, 
    { name, email, avatar, phone, preferences }, 
    { new: true }
  ).select('-password');
  
  res.json(formatSuccess(user, '✅ تم تحديث الملف الشخصي'));
}));

// Change password
router.put('/password', authMiddleware, catchAsync(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  
  if (!currentPassword || !newPassword) {
    throw new ValidationError('كلمتا المرور مطلوبتان');
  }
  
  if (newPassword.length < 6) {
    throw new ValidationError('كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل');
  }
  
  const user = await User.findById(req.user.id);
  const isMatch = await user.comparePassword(currentPassword);
  
  if (!isMatch) {
    throw new ValidationError('كلمة المرور الحالية غير صحيحة');
  }

  user.password = newPassword;
  await user.save();
  
  logger.info(`Password changed for user: ${user.username}`);
  
  res.json(formatSuccess(null, '✅ تم تغيير كلمة المرور'));
}));

module.exports = router;