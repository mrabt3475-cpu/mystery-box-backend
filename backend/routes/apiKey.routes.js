const express = require('express');
const router = express.Router();
const ApiKey = require('../models/ApiKey.model');
const { auth } = require('../middleware/auth.middleware');
const { catchAsync } = require('../middleware/errorHandler.middleware');
const { generateApiKey } = require('./apiKey.middleware');
const { NotFoundError, ValidationError } = require('../utils/AppError');
const { formatSuccess } = require('../utils/responseFormatter');

// Get user's API keys
router.get('/', auth, catchAsync(async (req, res) => {
  const keys = await ApiKey.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.json(formatSuccess(keys));
}));

// Create API key
router.post('/', auth, catchAsync(async (req, res) => {
  const { name, permissions, rateLimit, expiresAt } = req.body;
  const key = generateApiKey('pk');
  const prefix = key.substring(0, 8);

  const apiKey = await ApiKey.create({
    user: req.user.id,
    name,
    key,
    prefix,
    permissions: permissions || ['read'],
    rateLimit: rateLimit || 100,
    expiresAt
  });

  res.status(201).json(formatSuccess(
    { ...apiKey.toObject(), fullKey: key },
    '✅ تم إنشاء المفتاح'
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

  res.json(formatSuccess(null, '✅ تم إلغاء المفتاح'));
}));

module.exports = router;
