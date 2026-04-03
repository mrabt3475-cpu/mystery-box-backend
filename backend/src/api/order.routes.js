import { Router } from 'express';
import { orderController } from '../modules/order/order.controller.js';
import { authenticate, optionalAuth } from '../common/auth.middleware.js';

const router = Router();

// مسارات عامة
router.get('/:orderNumber', orderController.getOrderByNumber);

// مسارات محمية
router.get('/', authenticate, orderController.getMyOrders);
router.post('/', optionalAuth, orderController.createOrder);
router.put('/:id/status', authenticate, orderController.updateOrderStatus);
router.post('/:id/cancel', authenticate, orderController.cancelOrder);
router.post('/:id/refund', authenticate, orderController.requestRefund);

// الفاتورة
router.get('/:orderNumber/invoice', authenticate, orderController.getInvoice);

export default router;
