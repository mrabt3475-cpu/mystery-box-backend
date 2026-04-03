// Validation Utilities
const { validationResult, body, param, query } = require('express-validator');
const { ValidationError } = require('../utils/AppError');

// Validate request
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const message = errors.array()[0].msg;
    throw new ValidationError(message);
  }
  next();
};

// Common validators
const validators = {
  isObjectId: (field = 'id') => [
    param(field).isMongoId().withMessage('معرف غير صالح')
  ],
  register: [
    body('username')
      .isLength({ min: 3, max: 30 })
      .withMessage('اسم المستخدم 3-30 حرف')
      .matches(/^[a-zA-Z0-9_]+$/)
      .withMessage('حروف وأرقام وشرطات فقط'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('كلمة المرور 6 أحرف على الأقل'),
    body('name')
      .notEmpty()
      .withMessage('الاسم مطلوب')
      .isLength({ min: 2, max: 50 }),
    body('email').optional().isEmail(),
    validate
  ],
  login: [
    body('username').notEmpty().withMessage('اسم المستخدم مطلوب'),
    body('password').notEmpty().withMessage('كلمة المرور مطلوبة'),
    validate
  ],
  gift: [
    body('receiverId').isMongoId().withMessage('معرف المستلم غير صالح'),
    body('amount').isInt({ min: 1, max: 100000 }).withMessage('المبلغ 1-100000'),
    body('message').optional().isLength({ max: 500 }),
    validate
  ],
  pagination: [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    validate
  ]
};

module.exports = { validate, validators };
