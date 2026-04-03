// Auth Routes
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { validate } = require('../../middleware/validation.middleware');
const { protect, authorize } = require('../../middleware/auth.middleware');
const { loginLimiter, registerLimiter } = require('../../middleware/rateLimiter.middleware');
const authController = require('../../controllers/auth.controller');

// @route   POST /api/v1/auth/register
// @desc    Register a new user
// @access  Public
router.post(
  '/register',
  registerLimiter,
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  validate,
  authController.register
);

// @route   POST /api/v1/auth/login
// @desc    Login user
// @access  Public
router.post(
  '/login',
  loginLimiter,
  [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validate,
  authController.login
);

// @route   POST /api/v1/auth/logout
// @desc    Logout user
// @access  Private
router.post('/logout', protect, authController.logout);

// @route   GET /api/v1/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', protect, authController.getMe);

// @route   PUT /api/v1/auth/updateProfile
// @desc    Update user profile
// @access  Private
router.put(
  '/updateProfile',
  protect,
  [
    body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
    body('email').optional().isEmail().withMessage('Please provide a valid email'),
  ],
  validate,
  authController.updateProfile
);

// @route   PUT /api/v1/auth/updatePassword
// @desc    Update password
// @access  Private
router.put(
  '/updatePassword',
  protect,
  [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
  ],
  validate,
  authController.updatePassword
);

// @route   POST /api/v1/auth/forgotPassword
// @desc    Forgot password
// @access  Public
router.post(
  '/forgotPassword',
  [body('email').isEmail().withMessage('Please provide a valid email')],
  validate,
  authController.forgotPassword
);

// @route   PUT /api/v1/auth/resetPassword/:token
// @desc    Reset password
// @access  Public
router.put(
  '/resetPassword/:token',
  [
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  validate,
  authController.resetPassword
);

// @route   POST /api/v1/auth/verifyEmail/:token
// @desc    Verify email
// @access  Public
router.post('/verifyEmail/:token', authController.verifyEmail);

// @route   GET /api/v1/auth/refresh-token
// @desc    Refresh token
// @access  Public
router.post('/refresh-token', authController.refreshToken);

module.exports = router;
