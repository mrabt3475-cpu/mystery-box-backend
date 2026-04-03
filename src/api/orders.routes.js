import { Router } from 'express';
import Order from '../modules/orders/order.model.js';
import { authenticate } from '../../common/auth.middleware.js';

const router = Router();

// Get user's orders
router.get('/', authenticate, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort('-createdAt');
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Get order by ID
router.get('/:id', authenticate, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id
    });
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }
    res.json({ success: true, data: order });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Create new order
router.post('/', authenticate, async (req, res) => {
  try {
    const { items, paymentMethod } = req.body;
    
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    const order = await Order.create({
      user: req.user._id,
      items,
      total,
      paymentMethod
    });
    
    res.status(201).json({ success: true, data: order });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

export default router;
