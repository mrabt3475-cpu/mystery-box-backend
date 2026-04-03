// Order Routes
const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');
const orderController = require('../controllers/order.controller');

router.get('/', protect, orderController.getOrders);
router.get('/:id', protect, orderController.getOrder);
router.post('/', protect, orderController.createOrder);
router.put('/:id/status', protect, authorize('admin'), orderController.updateOrderStatus);

module.exports = router;
