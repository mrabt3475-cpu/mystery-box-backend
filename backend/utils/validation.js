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
  // ObjectId validation
  isObjectId: (field = 'id') => [
    param(field).isMongoId().withMessage('معرف غير صالح')
  ],

  // User registration
  register: [
    body('username')
      .isLength({ min: 3, max: 30 })
      .withMessage('اسم المستخدم يجب أن يكون 3-30 حرف')
      .matches(/^[a-zA-Z0-9_]+$/)
      .withMessage('اسم المستخدم يجب أن يكون حروف وأرقام وشرطات فقط'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('كلمة المرور يجب أن تكون 6 أحرف على الأقل'),
    body('name')
      .notEmpty()
      .withMessage('الاسم مطلوب')
      .isLength({ min: 2, max: 50 })
      .withMessage('الاسم يجب أن يكون 2-50 حرف'),
    body('email')
      .optional()
      .isEmail())
      .withMessage('بريد إلكتروني غير صالح'),
    validate
  ],

  // Login
  login: [
    body('username').notEmpty().withMessage('اسم المستخدم مطلوب'),
    body('password').notEmpty().withMessage('كلمة المرور مطلوبة'),
    validate
  ],

  // Box creation/update
  box: [
    body('name').notEmpty().withMessage('اسم الصندوق مطلوب'),
    body('cost').isInt({ min: 1 }).withMessage('التكلفة يجب أن تكون رقم موجب'),
    body('prizes').isArray({ min: 1 }).withMessage('يجب إضافة جوائز للصندوق'),
    validate
  ],

  // Product
  product: [
    body('name').notEmpty().withMessage('اسم المنتج مطلوب'),
    body('price').isFloat({ min: 0 }).withMessage('السعر يجب أن يكون رقم موجب'),
    validate
  ],

  // Gift
  gift: [
    body('receiverId').isMongoId().withMessage('معرف المستلم غير صالح'),
    body('amount').isInt({ min: 1, max: 100000 }).withMessage('المبلغ يجب أن يكون 1-100000'),
    body('message').optional().isLength({ max: 500 }).withMessage('الرسالة يجب أن تكون أقل من 500 حرف'),
    validate
  ],

  // Service
  service: [
    body('name').notEmpty().withMessage('اسم الخدمة مطلوب').isLength({ max: 100 }),
    body('serviceType').isIn(['group', 'channel', 'bot']).withMessage('نوع الخدمة غير صالح'),
    body('cost').optional().isInt({ min: 0 }),
    body('pointsRequired').optional().isInt({ min: 0 }),
    validate
  ],

  // Pagination
  pagination: [
    query('page').optional().isInt({ min: 1 }).withMessage('الصفحة يجب أن تكون رقم موجب'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('الحد يجب أن يكون 1-100'),
    validate
  ],

  // Object ID array
  isObjectIdArray: (field = 'ids') => [
    body(field).isArray().withMessage('يجب أن يكون مصفوفة'),
    body(field + '.*').isMongoId().withMessage('معرف غير صالح'),
    validate
  ]
};

module.exports = { validate, validators };
