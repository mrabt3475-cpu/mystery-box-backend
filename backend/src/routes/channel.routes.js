// Channel Routes
const express = require('express');
const router = express.Router();
const { body, param, query } = require('express-validator');
const { validate } = require('../../middleware/validation.middleware');
const { protect, authorize } = require('../../middleware/auth.middleware');
const channelController = require('../../controllers/channel.controller');

// @route   GET /api/v1/channels
// @desc    Get all channels
// @access  Public
router.get('/', channelController.getChannels);

// @route   GET /api/v1/channels/:id
// @desc    Get channel by ID
// @access  Public
router.get('/:id', channelController.getChannel);

// @route   GET /api/v1/channels/slug/:slug
// @desc    Get channel by slug
// @access  Public
router.get('/slug/:slug', channelController.getChannelBySlug);

// @route   POST /api/v1/channels
// @desc    Create new channel
// @access  Private
router.post(
  '/',
  protect,
  [
    body('name').trim().notEmpty().withMessage('Channel name is required'),
    body('description').optional().trim(),
  ],
  validate,
  channelController.createChannel
);

// @route   PUT /api/v1/channels/:id
// @desc    Update channel
// @access  Private (Owner/Admin)
router.put(
  '/:id',
  protect,
  channelController.updateChannel
);

// @route   DELETE /api/v1/channels/:id
// @desc    Delete channel
// @access  Private (Owner only)
router.delete(
  '/:id',
  protect,
  channelController.deleteChannel
);

// @route   POST /api/v1/channels/:id/join
// @desc    Join channel
// @access  Private
router.post('/:id/join', protect, channelController.joinChannel);

// @route   POST /api/v1/channels/:id/leave
// @desc    Leave channel
// @access  Private
router.post('/:id/leave', protect, channelController.leaveChannel);

// @route   GET /api/v1/channels/:id/members
// @desc    Get channel members
// @access  Public
router.get('/:id/members', channelController.getMembers);

// @route   GET /api/v1/channels/:id/products
// @desc    Get channel products
// @access  Public
router.get('/:id/products', channelController.getProducts);

// @route   GET /api/v1/channels/:id/boxes
// @desc    Get channel boxes
// @access  Public
router.get('/:id/boxes', channelController.getBoxes);

// @route   GET /api/v1/channels/:id/streams
// @desc    Get channel streams
// @access  Public
router.get('/:id/streams', channelController.getStreams);

module.exports = router;
