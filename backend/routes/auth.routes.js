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

const generateTokens = (userId) => {
  const jwtSecret = process.env.JWT_SECRET || 'default-secret';
  const refreshSecret = process.env.JWT_REFRESH_SECRET || 'default-refresh-secret';
  const accessToken = jwt.sign({ id: userId }, jwtSecret, { expiresIn: process.env.JWT_EXPIRE || '15m' });
  const refreshToken = jwt.sign({ id: userId }, refreshSecret, { expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d' });
  return { accessToken, refreshToken };
};

// Register
router.post('/register', validators.register, catchAsync(async (req, res) => {
  const { username, password, name, email, referralCode } = req.body;
  
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

  res.status(201).json(formatSuccess(
    { user, accessToken, refreshToken },
    '✅ تم التسجيل بنجاح'
  ));
}));

// Login
router.post('/login', validators.login, catchAsync(async (req, res) => {
  const { username, password } = req.body;
  
  const user = await User.findOne({ username });
  if (!user) {
    throw new UnauthorizedError('بيانات الدخول غير صحيحة');
  }

  if (user.isLocked()) {
    throw new UnauthorizedError('الحساب مقفل مؤقتاً');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    await user.incrementLoginAttempts();
    throw new UnauthorizedError('بيانات الدخول غير صحيحة');
  }

  await user.resetLoginAttempts();
  user.lastLogin = new Date();
  await user.save();

  const { accessToken, refreshToken } = generateTokens(user._id);
  
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
  
  const refreshSecret = process.env.JWT_REFRESH_SECRET || 'default-refresh-secret';
  const decoded = jwt.verify(refreshToken, refreshSecret);
  
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
    throw new ValidationError('كلمة المرور الجديدة 6 أحرف على الأقل');
  }
  
  const user = await User.findById(req.user.id);
  const isMatch = await user.comparePassword(currentPassword);
  
  if (!isMatch) {
    throw new ValidationError('كلمة المرور الحالية غير صحيحة');
  }

  user.password = newPassword;
  await user.save();
  
  res.json(formatSuccess(null, '✅ تم تغيير كلمة المرور'));
}));

module.exports = router;
