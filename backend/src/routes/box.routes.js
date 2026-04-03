// Box Routes
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { validate } = require('../../middleware/validation.middleware');
const { protect, authorize } = require('../../middleware/auth.middleware');
const boxController = require('../../controllers/box.controller');

// @route   GET /api/v1/boxes
// @desc    Get all boxes
// @access  Public
router.get('/', boxController.getBoxes);

// @route   GET /api/v1/boxes/:id
// @desc    Get box by ID
// @access  Public
router.get('/:id', boxController.getBox);

// @route   POST /api/v1/boxes
// @desc    Create new box
// @access  Private (Channel Owner/Admin)
router.post(
  '/',
  protect,
  [
    body('name').trim().notEmpty().withMessage('Box name is required'),
    body('price').isNumeric().withMessage('Price must be a number'),
    body('channel').isMongoId().withMessage('Valid channel ID is required'),
  ],
  validate,
  boxController.createBox
);

// @route   PUT /api/v1/boxes/:id
// @desc    Update box
// @access  Private (Channel Owner/Admin)
router.put('/:id', protect, boxController.updateBox);


// @route   DELETE /api/v1/boxes/:id
// @desc    Delete box
// @access  Private (Channel Owner/Admin)
router.delete('/:id', protect, boxController.deleteBox);

// @route   POST /api/v1/boxes/:id/open
// @desc    Open a box
// @access  Private
router.post(
  '/:id/open',
  protect,
  boxController.openBox
);

// @route   GET /api/v1/boxes/:id/prizes
// @desc    Get box prizes
// @access  Public
router.get('/:id/prizes', boxController.getBoxPrizes);

// @route   GET /api/v1/boxes/featured
// @desc    Get featured boxes
// @access  Public
router.get('/featured/list', boxController.getFeaturedBoxes);

module.exports = router;
