const express = require('express');
const router = express.Router();
const ChannelGroup = require('../models/ChannelGroup.model');
const { auth, adminAuth } = require('../middleware/auth.middleware');
const { body, validationResult } = require('express-validator');

// @route   GET /api/channel-groups
// @desc    Get all channel groups
// @access  Admin
router.get('/',
  auth,
  adminAuth,
  async (req, res) => {
    try {
      const { type, status, page = 1, limit = 20 } = req.query;
      
      const filter = {};
      if (type) filter.type = type;
      if (status) filter.status = status;

      const groups = await ChannelGroup.find(filter)
        .populate('owner', 'username name')
        .populate('moderators.user', 'username name')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit));

      const total = await ChannelGroup.countDocuments(filter);

      res.json({
        success: true,
        data: groups,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
);

// @route   GET /api/channel-groups/:id
// @desc    Get single channel group
// @access  Admin
router.get('/:id',
  auth,
  adminAuth,
  async (req, res) => {
    try {
      const group = await ChannelGroup.findById(req.params.id)
        .populate('owner', 'username name')
        .populate('moderators.user', 'username name');

      if (!group) {
        return res.status(404).json({
          success: false,
          error: 'المجموعة غير موجودة'
        });
      }

      res.json({
        success: true,
        data: group
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
);

// @route   POST /api/channel-groups
// @desc    Create channel group
// @access  Admin
router.post('/',
  auth,
  adminAuth,
  [
    body('name').isString().notEmpty(),
    body('type').isIn(['channel', 'group', 'supergroup']),
    body('chatId').isString().notEmpty(),
    body('title').isString().notEmpty()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array()
        });
      }

      const existing = await ChannelGroup.findOne({ chatId: req.body.chatId });
      if (existing) {
        return res.status(400).json({
          success: false,
          error: 'هذه المجموعة موجودة بالفعل'
        });
      }

      const group = await ChannelGroup.create({
        ...req.body,
        owner: req.user._id
      });

      res.status(201).json({
        success: true,
        message: 'تم إضافة المجموعة بنجاح',
        data: group
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
);

// @route   PUT /api/channel-groups/:id
// @desc    Update channel group
// @access  Admin
router.put('/:id',
  auth,
  adminAuth,
  async (req, res) => {
    try {
      const group = await ChannelGroup.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true, runValidators: true }
      );

      if (!group) {
        return res.status(404).json({
          success: false,
          error: 'المجموعة غير موجودة'
        });
      }

      res.json({
        success: true,
        message: 'تم تحديث المجموعة بنجاح',
        data: group
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
);

// @route   PUT /api/channel-groups/:id/design
// @desc    Update group design
// @access  Admin
router.put('/:id/design',
  auth,
  adminAuth,
  [
    body('backgroundColor').optional().isString(),
    body('textColor').optional().isString(),
    body('coverImage').optional().isString()
  ],
  async (req, res) => {
    try {
      const group = await ChannelGroup.findById(req.params.id);
      
      if (!group) {
        return res.status(404).json({
          success: false,
          error: 'المجموعة غير موجودة'
        });
      }

      Object.assign(group.design, req.body);
      await group.save();

      res.json({
        success: true,
        message: 'تم تحديث التصميم بنجاح',
        data: group.design
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
);

// @route   PUT /api/channel-groups/:id/security
// @desc    Update group security settings
// @access  Admin
router.put('/:id/security',
  auth,
  adminAuth,
  async (req, res) => {
    try {
      const group = await ChannelGroup.findById(req.params.id);
      
      if (!group) {
        return res.status(404).json({
          success: false,
          error: 'المجموعة غير موجودة'
        });
      }

      Object.assign(group.security, req.body);
      await group.save();

      res.json({
        success: true,
        message: 'تم تحديث إعدادات الأمان بنجاح',
        data: group.security
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
);

// @route   DELETE /api/channel-groups/:id
// @desc    Delete channel group
// @access  Admin
router.delete('/:id',
  auth,
  adminAuth,
  async (req, res) => {
    try {
      const group = await ChannelGroup.findByIdAndDelete(req.params.id);

      if (!group) {
        return res.status(404).json({
          success: false,
          error: 'المجموعة غير موجودة'
        });
      }

      res.json({
        success: true,
        message: 'تم حذف المجموعة بنجاح'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
);

// @route   GET /api/channel-groups/public
// @desc    Get public channel groups
// @access  Public
router.get('/public/list', async (req, res) => {
    try {
      const groups = await ChannelGroup.find({ status: 'active' })
        .select('name type title description design inviteLink stats');

      res.json({
        success: true,
        data: groups
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