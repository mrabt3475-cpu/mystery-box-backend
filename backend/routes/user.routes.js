const express = require('express');
const router = express.Router();
const User = require('../models/user.model');
const { auth } = require('../middleware/auth.middleware');
const { query, validationResult } = require('express-validator');

// Validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, error: errors.array()[0].msg });
  }
  next();
};

// Search users by username
router.get('/search',
  auth,
  [
    query('username').isLength({ min: 1 }).withMessage('اسم المستخدم مطلوب'),
    query('limit').optional().isInt({ min: 1, max: 20 })
  ],
  validate,
  async (req, res) => {
    try {
      const { username } = req.query;
      const limit = parseInt(req.query.limit) || 10;

      // Search users excluding current user
      const users = await User.find({
        username: { $regex: username, $options: 'i' },
        _id: { $ne: req.user.id }
      })
      .select('name username avatar')
      .limit(limit);

      res.json({
        success: true,
        data: users[0] || null
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
);

// Get user by ID
router.get('/:id',
  auth,
  async (req, res) => {
    try {
      const user = await User.findById(req.params.id)
        .select('name username avatar');

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'المستخدم غير موجود'
        });
      }

      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
);

// Get users by username (for gift)
router.get('/username/:username',
  auth,
  async (req, res) => {
    try {
      const user = await User.findOne({
        username: req.params.username,
        _id: { $ne: req.user.id }
      })
      .select('name username avatar');

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'المستخدم غير موجود'
        });
      }

      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
);

module.exports = router;
