// Channel Routes
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { validate } = require('../middleware/validation.middleware');
const { protect } = require('../middleware/auth.middleware');
const channelController = require('../controllers/channel.controller');

// Validation
const createChannelValidation = [
  body('name').trim().notEmpty().withMessage('Channel name is required'),
  body('description').optional().trim(),
];

// Routes
router.get('/', channelController.getChannels);
router.get('/:id', channelController.getChannel);
router.post('/', protect, createChannelValidation, validate, channelController.createChannel);
router.put('/:id', protect, channelController.updateChannel);
router.delete('/:id', protect, channelController.deleteChannel);
router.post('/:id/join', protect, channelController.joinChannel);

module.exports = router;
