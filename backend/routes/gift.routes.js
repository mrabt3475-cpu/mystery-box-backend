const express = require('express');
const router = express.Router();
const giftService = require('../services/gift.service');
const { auth } = require('../middleware/auth.middleware');
const { body, query, validationResult } = require('express-validator');

// Validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, error: errors.array()[0].msg });
  }
  next();
};

// Send gift points
router.post('/send',
  auth,
  [
    body('receiverId').isMongoId().withMessage('معرف المستلم غير صالح'),
    body('amount').isInt({ min: 1 }).withMessage('الحد الأدنى للهدية نقطة واحدة'),
    body('message').optional().isLength({ max: 500 }),
    body('isAnonymous').optional().isBoolean()
  ],
  validate,
  async (req, res) => {
    try {
      const { receiverId, amount, message, isAnonymous } = req.body;
      
      const gift = await giftService.sendGift(
        req.user.id,
        receiverId,
        amount,
        message,
        { isAnonymous }
      );

      res.json({
        success: true,
        data: gift
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
);

// Get gift history
router.get('/history',
  auth,
  [
    query('type').optional().isIn(['all', 'sent', 'received']),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 50 })
  ],
  validate,
  async (req, res) => {
    try {
      const { type = 'all', page = 1, limit = 20 } = req.query;
      
      const result = await giftService.getGiftHistory(
        req.user.id,
        type,
        parseInt(page),
        parseInt(limit)
      );

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
);

// Get gift statistics
router.get('/stats',
  auth,
  async (req, res) => {
    try {
      const stats = await giftService.getGiftStats(req.user.id);
      
      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
);

module.exports = router;
