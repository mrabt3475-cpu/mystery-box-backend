// Auth Routes
const express = require('express');
const router = express.Router();
const authService = require('../services/auth.service');
const { protect } = require('../middleware/auth.middleware');
const { validate, validateRegister, validateLogin } = require('../middleware/validation.middleware');
const { authLimiter } = require('../middleware/rateLimiter.middleware');

router.post('/register', validateRegister, validate, async (req, res, next) => {
  try {
    const { name, email, password, referralCode } = req.body;
    const result = await authService.register({ name, email, password, referralCode });
    rest.status(201).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

router.post('/login', authLimiter, validateLogin, validate, async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login({ email, password });
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

router.get('/me', protect, async (req, res, next) => {
  try {
    const user = await authService.getMe(req.user._id);
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
});

router.put('/password', protect, async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const result = await authService.updatePassword(req.user._id, currentPassword, newPassword);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

router.post('/forgot-password', authLimiter, async (req, res, next) => {
  try {
    const { email } = req.body;
    await authService.forgotPassword(email);
    res.json({ success: true, message: 'Password reset email sent' });
  } catch (error) {
    next(error);
  }
});

router.post('/reset-password/:token', async (req, res, next) => {
  try {
    const { password } = req.body;
    const result = await authService.resetPassword(req.params.token, password);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
