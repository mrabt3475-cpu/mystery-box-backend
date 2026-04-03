const express = require('express');
const router = express.Router();
const GiftService = require('../services/gift.service');
const { auth } = require('../middleware/auth.middleware');
const { body, validationResult } = require('express-validator');

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
    body('amount').isInt({ min: 1 }).withMessage('الحد الأدنى نقطة واحدة'),
    body('message').optional().isLength({ max: 500 }),
    body('isAnonymous').optional().isBoolean()
  ],
  validate,
  async (req, res) => {
    try {
      const { receiverId, amount, message, isAnonymous } = req.body;
      
      const gift = await GiftService.sendGift(
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
  async (req, res) => {
    try {
      const { type = 'all', page = 1, limit = 20 } = req.query;
      
      const result = await GiftService.getGiftHistory(
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
      const stats = await GiftService.getGiftStats(req.user.id);
      
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
