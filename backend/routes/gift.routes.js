const express = require('express');
const router = express.Router();
const GiftService = require('../services/gift.service');
const { auth } = require('../middleware/auth.middleware');
const { giftLimiter } = require('../middleware/rateLimiter.middleware');
const { catchAsync } = require('../utils/errorHandler');
const { sendGiftValidation } = require('../utils/validation');
const { validationResult } = require('express-validator');

// Validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, error: errors.array()[0].msg });
  }
  next();
};

// Send gift points - with rate limiting
router.post('/send', auth, giftLimiter, sendGiftValidation, validate, catchAsync(async (req, res) => {
  const { receiverId, amount, message, isAnonymous } = req.body;
  
  const gift = await GiftService.sendGift(
    req.user.id,
    receiverId,
    amount,
    message,
    { isAnonymous }
  );
  
  res.json({ success: true, data: gift });
}));

// Get gift history
router.get('/history', auth, catchAsync(async (req, res) => {
  const { type = 'all', page = 1, limit = 20 } = req.query;
  
  const result = await GiftService.getGiftHistory(
    req.user.id,
    type,
    parseInt(page),
    parseInt(limit)
  );
  
  res.json({ success: true, data: result });
}));

// Get gift statistics
router.get('/stats', auth, catchAsync(async (req, res) => {
  const stats = await GiftService.getGiftStats(req.user.id);
  
  res.json({ success: true, data: stats });
}));

module.exports = router;
