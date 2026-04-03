const express = require('express');
const router = express.Router();
const Prize = require('../models/Prize.model');
const { auth } = require('../middleware/auth.middleware');
const { catchAsync } = require('../middleware/errorHandler.middleware');
const { validators } = require('../utils/validation');
const { NotFoundError, ValidationError } = require('../utils/AppError');
const { formatSuccess } = require('../utils/responseFormatter');

// Get all prizes
router.get('/', catchAsync(async (req, res) => {
  const prizes = await Prize.find({ isActive: true }).sort({ rarity: 1 });
  res.json(formatSuccess(prizes));
}));

// Get prize by ID
router.get('/:id', validators.isObjectId('id'), catchAsync(async (req, res) => {
  const prize = await Prize.findById(req.params.id);
  if (!prize) {
    throw new NotFoundError('الجائزة');
  }
  res.json(formatSuccess(prize));
}));

// Admin: Create prize
router.post('/', auth, catchAsync(async (req, res) => {
  if (req.user.role !== 'admin') {
    throw new ValidationError('غير مصرح لك');
  }
  const prize = await Prize.create(req.body);
  res.status(201).json(formatSuccess(prize, '✅ تم إنشاء الجائزة'));
}));

// Admin: Update prize
router.put('/:id', auth, validators.isObjectId('id'), catchAsync(async (req, res) => {
  if (req.user.role !== 'admin') {
    throw new ValidationError('غير مصرح لك');
  }
  const prize = await Prize.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!prize) {
    throw new NotFoundError('الجائزة');
  }
  res.json(formatSuccess(prize, '✅ تم تحديث الجائزة'));
}));

// Admin: Delete prize
router.delete('/:id', auth, validators.isObjectId('id'), catchAsync(async (req, res) => {
  if (req.user.role !== 'admin') {
    throw new ValidationError('غير مصرح لك');
  }
  const prize = await Prize.findByIdAndDelete(req.params.id);
  if (!prize) {
    throw new NotFoundError('الجائزة');
  }
  res.json(formatSuccess(null, '✅ تم حذف الجائزة'));
}));

module.exports = router;
