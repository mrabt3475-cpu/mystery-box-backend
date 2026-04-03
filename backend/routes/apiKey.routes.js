const express = require('express');
const router = express.Router();
const ApiKey = require('../models/ApiKey.model');
const { auth } = require('../middleware/auth.middleware');
const { catchAsync } = require('../middleware/errorHandler.middleware');
const { generateApiKey } = require('./apiKey.middleware');
const { NotFoundError, ValidationError } = require('../utils/AppError');
const { formatSuccess } = require('../utils/responseFormatter');
const { logger } = require('../utils/logger');

// Get user's API keys
router.get('/', auth, catchAsync(async (req, res) => {
  const keys = await ApiKey.find({ user: req.user.id }).sort({ createdAt: -1 });
  // Don't expose full key
  const safeKeys = keys.map(k => ({
    _id: k._id,
    name: k.name,
    prefix: k.prefix,
    permissions: k.permissions,
    rateLimit: k.rateLimit,
    expiresAt: k.expiresAt,
    lastUsed: k.lastUsed,
    isActive: k.isActive,
    usageCount: k.usageCount,
    createdAt: k.createdAt
  }));
  res.json(formatSuccess(safeKeys));
}));

// Create API key - WITH VALIDATION
router.post('/', auth, catchAsync(async (req, res) => {
  const { name, permissions, rateLimit, expiresAt } = req.body;

  // Validate name
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    throw new ValidationError('اسم المفتاح مطلوب');
  }
  
  if (name.trim().length < 3 || name.trim().length > 50) {
    throw new ValidationError('اسم المفتاح يجب أن يكون 3-50 حرف');
  }

  // Validate permissions
  if (!permissions || !Array.isArray(permissions) || permissions.length === 0) {
    throw new ValidationError('يجب تحديد صلاحية واحدة على الأقل');
  }
  
  const validPermissions = ['read', 'write', 'admin'];
  const hasInvalidPerm = permissions.some(p => !validPermissions.includes(p));
  if (hasInvalidPerm) {
    throw new ValidationError('صلاحيات غير صالحة');
  }

  // Validate rateLimit
  if (rateLimit !== undefined) {
    if (typeof rateLimit !== 'number' || rateLimit < 1 || rateLimit > 10000) {
      throw new ValidationError('Rate limit يجب أن يكون بين 1 و 10000');
    }
  }

  // Validate expiresAt
  if (expiresAt) {
    const expDate = new Date(expiresAt);
    if (isNaN(expDate.getTime())) {
      throw new ValidationError('تاريخ انتهاء غير صالح');
    }
    if (expDate < new Date()) {
      throw new ValidationError('تاريخ الانتهاء يجب أن يكون في المستقبل');
    }
  }

  // Generate key
  const key = generateApiKey('pk');
  const prefix = key.substring(0, 8);

  const apiKey = await ApiKey.create({
    user: req.user.id,
    name: name.trim(),
    key,
    prefix,
    permissions,
    rateLimit: rateLimit || 100,
    expiresAt
  });

  logger.info(`API key created for user ${req.user.id}`, { keyName: name });

  res.status(201).json(formatSuccess(
    { ...apiKey.toObject(), fullKey: key },
    '✅ تم إنشاء المفتاح - احفظه في مكان آمن'
  ));
}));

// Revoke API key
router.delete('/:id', auth, catchAsync(async (req, res) => {
  const apiKey = await ApiKey.findOne({ _id: req.params.id, user: req.user.id });
  if (!apiKey) {
    throw new NotFoundError('المفتاح');
  }

  apiKey.isActive = false;
  await apiKey.save();

  logger.info(`API key revoked for user ${req.user.id}`, { keyId: req.params.id });

  res.json(formatSuccess(null, '✅ تم إلغاء المفتاح'));
}));

module.exports = router;