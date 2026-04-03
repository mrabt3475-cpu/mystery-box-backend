// Input Validation Rules

const { body, param, query } = require('express-validator');

// Common validation rules
const ObjectId = (field = 'id') => 
  param(field).isMongoId().withMessage(`معرف ${field} غير صالح`);

const required = (field, minLength = 1) => 
  body(field).trim().isLength({ min: minLength }).withMessage(`حقل ${field} مطلوب`);

const optional = (field) => 
  body(field).optional();

const email = (field = 'email') => 
  body(field).isEmail().withMessage('بريد إلكتروني غير صالح').normalizeEmail();

const minLength = (field, min) => 
  body(field).isLength({ min }).withMessage(`حقل ${field} يجب أن يكون ${min} أحرف على الأقل`);

const maxLength = (field, max) => 
  body(field).isLength({ max }).withMessage(`حقل ${field} يجب أن يكون ${max} أحرف على الأكثر`);

const isNumber = (field, min = undefined, max = undefined) => {
  let validator = body(field).isNumeric().withMessage(`حقل ${field} يجب أن يكون رقم`);
  if (min !== undefined) validator = validator.isInt({ min }).withMessage(`حقل ${field} يجب أن يكون ${min} على الأقل`);
  if (max !== undefined) validator = validator.isInt({ max }).withMessage(`حقل ${field} يجب أن يكون ${max} على الأكثر`);
  return validator;
};

const isBoolean = (field) => 
  body(field).isBoolean().withMessage(`حقل ${field} يجب أن يكون true أو false`);

const isEnum = (field, allowedValues) => 
  body(field).isIn(allowedValues).withMessage(`حقل ${field} يجب أن يكون واحد من: ${allowedValues.join(', ')}`);

// Auth validations
exports.registerValidation = [
  required('username', 3),
  maxLength('username', 30),
  body('username').matches(/^[a-zA-Z0-9_]+$/).withMessage('اسم المستخدم يجب أن يكون حروف وأرقام و underscore فقط'),
  required('password', 6),
  maxLength('password', 50),
  required('name', 2),
  maxLength('name', 100),
  email('email').optional({ nullable: true })
];

exports.loginValidation = [
  required('username'),
  required('password')
];

// Box validations
exports.openBoxValidation = [
  ObjectId('id'),
  body('clientSeed').optional().isString().isLength({ min: 16, max: 64 })
];

// Product validations
exports.createProductValidation = [
  required('name', 2),
  maxLength('name', 100),
  isNumber('price', 0),
  isNumber('pointsReward', 0),
  optional('description'),
  maxLength('description', 1000)
];

// Order validations
exports.createOrderValidation = [
  body('items').isArray({ min: 1 }).withMessage('يجب إضافة منتج واحد على الأقل'),
  body('items.*.product').isMongoId().withMessage('معرف المنتج غير صالح'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('الكمية يجب أن تكون 1 على الأقل'),
  isEnum('paymentMethod', ['points', 'stripe', 'ton', 'wallet'])
];

// Gift validations
exports.sendGiftValidation = [
  ObjectId('receiverId'),
  isNumber('amount', 1),
  maxLength('message', 500),
  isBoolean('isAnonymous').optional()
];

// Service validations
exports.createServiceValidation = [
  required('name', 2),
  maxLength('name', 50),
  maxLength('description', 500),
  isEnum('serviceType', ['group', 'channel', 'bot']),
  isNumber('cost', 0).optional(),
  isNumber('pointsRequired', 0).optional(),
  isEnum('joinMode', ['free', 'points', 'invite']).optional()
];

// Points validations
exports.addPointsValidation = [
  ObjectId('userId'),
  isNumber('amount', 1),
  optional('type'),
  maxLength('description', 200)
];

// Pagination
exports.paginationValidation = [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt()
];

// Search
exports.searchValidation = [
  query('search').optional().isLength({ min: 2, max: 50 })
];
