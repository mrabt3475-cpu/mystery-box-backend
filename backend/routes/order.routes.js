const express = require('express');
const router = express.Router();
const Order = require('../models/Order.model');
const User = require('../models/user.model');
const Product = require('../models/Product.model');
const PointsTransaction = require('../models/pointsTransaction.model');
const { auth } = require('../middleware/auth.middleware');

// Get user's orders
router.get('/my', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('items.product')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create order
router.post('/', auth, async (req, res) => {
  try {
    const { items, paymentMethod, shippingAddress, notes } = req.body;
    const user = await User.findById(req.user.id);

    let total = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(400).json({ 
          success: false, 
          error: `المنتج ${item.product} غير موجود` 
        });
      }
      total += product.price * item.quantity;
      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.image
      });
    }

    // Check points for points payment
    if (paymentMethod === 'points') {
      if (user.pointsBalance < total) {
        return res.status(400).json({ 
          success: false, 
          error: 'رصيدك غير كافٍ' 
        });
      }
      user.pointsBalance -= total;
      await user.save();

      // Record points transaction
      await PointsTransaction.create({
        user: user._id,
        amount: -total,
        type: 'purchase',
        description: `شراء منتجات بقيمة ${total} نقطة`,
        balanceAfter: user.pointsBalance
      });
    }

    const order = await Order.create({
      user: user._id,
      items: orderItems,
      total,
      paymentMethod: paymentMethod || 'points',
      shippingAddress,
      notes,
      status: 'pending'
    });

    res.status(201).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get order by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user.id })
      .populate('items.product');
    
    if (!order) {
      return res.status(404).json({ success: false, error: 'الطلب غير موجود' });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Cancel order
router.post('/:id/cancel', auth, async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user.id });
    
    if (!order) {
      return res.status(404).json({ success: false, error: 'الطلب غير موجود' });
    }

    if (order.status !== 'pending') {
      return res.status(400).json({ 
        success: false, 
        error: 'لا يمكن إلغاء هذا الطلب' 
      });
    }

    // Refund points if paid by points
    if (order.paymentMethod === 'points') {
      const user = await User.findById(req.user.id);
      user.pointsBalance += order.total;
      await user.save();

      await PointsTransaction.create({
        user: user._id,
        amount: order.total,
        type: 'refund',
        description: `استرداد طلب #${order._id}`,
        balanceAfter: user.pointsBalance
      });
    }

    order.status = 'cancelled';
    await order.save();

    res.json({ success: true, message: 'تم إلغاء الطلب واسترداد الرصيد' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Admin: Get all orders
router.get('/admin/all', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'غير مصرح' });
    }

    const { page = 1, limit = 20, status } = req.query;
    const query = status ? { status } : {};

    const orders = await Order.find(query)
      .populate('user', 'name email username')
      .populate('items.product')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Admin: Update order status
router.put('/admin/:id/status', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'غير مصرح' });
    }

    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('user', 'name email');

    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
