// Order Routes
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { validate } = require('../middleware/validation.middleware');
const { protect } = require('../middleware/auth.middleware');
const orderController = require('../controllers/order.controller');

// Validation
const createOrderValidation = [
  body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
];

// Routes
router.get('/', protect, orderController.getOrders);
router.get('/:id', protect, orderController.getOrder);
router.post('/', protect, createOrderValidation, validate, orderController.createOrder);
router.put('/:id/cancel', protect, orderController.cancelOrder);

module.exports = router;
