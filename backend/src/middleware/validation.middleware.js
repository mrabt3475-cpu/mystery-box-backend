// Validation Middleware
const { validationResult } = require('express-validator');

// Check for validation errors
exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }
  next();
};

// Validation Rules
exports.validateRegister = [
  // Name validation
  require('express-validator').body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),

  // Email validation
  require('express-validator').body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),

  // Password validation
  require('express-validator').body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
    .matches(/\d/).withMessage('Password must contain a number'),
];

exports.validateLogin = [
  require('express-validator').body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email'),

  require('express-validator').body('password')
    .notEmpty().withMessage('Password is required'),
];

exports.validateProduct = [
  require('express-validator').body('name')
    .trim()
    .notEmpty().withMessage('Product name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),

  require('express-validator').body('price')
    .notEmpty().withMessage('Price is required')
    .isFloat({ min: 0 }).withMessage('Price must be a positive number'),

  require('express-validator').body('category')
    .notEmpty().withMessage('Category is required'),
];

exports.validateOrder = [
  require('express-validator').body('items')
    .isArray({ min: 1 }).withMessage('Order must have at least one item'),

  require('express-validator').body('paymentMethod')
    .notEmpty().withMessage('Payment method is required')
    .isIn(['card', 'crypto', 'wallet']).withMessage('Invalid payment method'),
];
