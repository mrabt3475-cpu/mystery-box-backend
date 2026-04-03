const express = require('express');
const router = express.Router();
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const authMiddleware = require('../middleware/auth.middleware');

// Validation
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, error: errors.array()[0].msg });
  }
  next();
};

// Generate tokens
const generateTokens = (userId) => {
  const jwtSecret = process.env.JWT_SECRET || 'default-secret';
  const refreshSecret = process.env.JWT_REFRESH_SECRET || 'default-refresh-secret';
  
  const accessToken = jwt.sign({ id: userId }, jwtSecret, {
    expiresIn: process.env.JWT_EXPIRE || '15m'
  });
  
  const refreshToken = jwt.sign({ id: userId }, refreshSecret, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d'
  });
  
  return { accessToken, refreshToken };
};

// Register
router.post('/register',
  [
    body('username').isLength({ min: 3, max: 30 }).withMessage('اسم المستخدم 3-30 حرف'),
    body('password').isLength({ min: 6 }).withMessage('كلمة المرور 6 أحرف على الأقل'),
    body('name').notEmpty().withMessage('الاسم مطلوب')
  ],
  validate,
  async (req, res) => {
    try {
      const { username, password, name, email, referralCode } = req.body;

      // Check existing user
      const existingUser = await User.findOne({ $or: [{ username }, { email }] });
      if (existingUser) {
        return res.status(400).json({ success: false, error: 'المستخدم موجود مسبقاً' });
      }

      // Check referral
      let referredByUser = null;
      if (referralCode) {
        referredByUser = await User.findOne({ referralCode });
      }

      // Create user
      const user = await User.create({
        username,
        password,
        name,
        email,
        referralCode: new mongoose.Types.ObjectId().toString('hex').slice(0, 8).toUpperCase(),
        referredBy: referredByUser?._id
      });

      // Generate tokens
      const { accessToken, refreshToken } = generateTokens(user._id);

      // Referral bonus
      if (referredByUser) {
        referredByUser.pointsBalance += 10;
        await referredByUser.save();
      }

      res.status(201).json({
        success: true,
        data: {
          user,
          accessToken,
          refreshToken
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
);

// Login
router.post('/login',
  [
    body('username').notEmpty(),
    body('password').notEmpty()
  ],
  validate,
  async (req, res) => {
    try {
      const { username, password } = req.body;

      const user = await User.findOne({ username });
      if (!user) {
        return res.status(401).json({ success: false, error: 'بيانات الدخول غير صحيحة' });
      }

      // Check password
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ success: false, error: 'بيانات الدخول غير صحيحة' });
      }

      // Update login
      user.lastLogin = new Date();
      await user.save();

      const { accessToken, refreshToken } = generateTokens(user._id);

      res.json({
        success: true,
        data: {
          user,
          accessToken,
          refreshToken
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
);

// Refresh token
router.post('/refresh',
  async (req, res) => {
    try {
      const { refreshToken } = req.body;
      const refreshSecret = process.env.JWT_REFRESH_SECRET || 'default-refresh-secret';
      
      const decoded = jwt.verify(refreshToken, refreshSecret);
      const user = await User.findById(decoded.id);
      
      if (!user) {
        return res.status(401).json({ success: false, error: 'Invalid token' });
      }

      const tokens = generateTokens(user._id);

      res.json({
        success: true,
        data: tokens
      });
    } catch (error) {
      res.status(401).json({ success: false, error: 'Invalid token' });
    }
  }
);

// Get current user
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update profile
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { name, email, avatar, phone, preferences } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, email, avatar, phone, preferences },
      { new: true }
    ).select('-password');

    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Change password
router.put('/password', authMiddleware,
  [
    body('currentPassword').notEmpty(),
    body('newPassword').isLength({ min: 6 })
  ],
  validate,
  async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      
      const user = await User.findById(req.user.id);
      const isMatch = await user.comparePassword(currentPassword);
      
      if (!isMatch) {
        return res.status(400).json({ success: false, error: 'كلمة المرور الحالية غير صحيحة' });
      }

      user.password = newPassword;
      await user.save();

      res.json({ success: true, message: 'تم تغيير كلمة المرور' });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
);

module.exports = router;
