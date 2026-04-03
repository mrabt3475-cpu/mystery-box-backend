const express = require('express');
const router = express.Router();
const User = require('../models/user.model');
const { auth } = require('../middleware/auth.middleware');
const { catchAsync } = require('../middleware/errorHandler.middleware');
const { NotFoundError, ValidationError } = require('../utils/AppError');
const { formatSuccess } = require('../utils/responseFormatter');
const { logger } = require('../utils/logger');

// Search users
router.get('/search', auth, catchAsync(async (req, res) => {
  const { username } = req.query;
  
  if (!username || username.length < 2) {
    throw new ValidationError('اسم المستخدم يجب أن يكون حرفين على الأقل');
  }
  
  const users = await User.find({ 
    username: { $regex: username, $options: 'i' }, 
    _id: { $ne: req.user.id },
    isActive: true
  }).select('name username avatar').limit(10);
  
  res.json(formatSuccess(users[0] || null));
}));

// Get user by ID
router.get('/:id', auth, catchAsync(async (req, res) => {
  const user = await User.findById(req.params.id).select('name username avatar');
  if (!user) {
    throw new NotFoundError('المستخدم');
  }
  res.json(formatSuccess(user));
}));

module.exports = router;