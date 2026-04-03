// Order Routes
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { validate } = require('../../middleware/validation.middleware');
const { protect, authorize } = require('../../middleware/auth.middleware');
const orderController = require('../../controllers/order.controller');

// @route   GET /api/v1/orders
// @desc    Get user orders
// @access  Private
router.get('/', protect, orderController.getOrders);

// @route   GET /api/v1/orders/:id
// @desc    Get order by ID
// @access  Private
router.get('/:id', protect, orderController.getOrder);

// @route   POST /api/v1/orders
// @desc    Create new order
// @access  Private
router.post(
  '/',
  protect,
  [
    body('items').isArray().withMessage('Items array is required'),
    body('items.*.product').isMongoId().withMessage('Valid product ID is required'),
  ],
  validate,
  orderController.createOrder
);

// @route   PUT /api/v1/orders/:id/cancel
// @desc    Cancel order
// @access  Private
router.put('/:id/cancel', protect, orderController.cancelOrder);

// @route   GET /api/v1/orders/:id/download
// @desc    Download order product
// @access  Private
router.get('/:id/download', protect, orderController.downloadProduct);

module.exports = router;
