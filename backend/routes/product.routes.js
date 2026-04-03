const express = require('express');
const router = express.Router();
const Product = require('../models/Product.model');
const Order = require('../models/Order.model');
const User = require('../models/user.model');
const { auth } = require('../middleware/auth.middleware');

// Get all products
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20, category, search } = req.query;
    const query = { isActive: true };
    if (category) query.category = category;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const products = await Product.find(query)
      .sort({ order: 1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Product.countDocuments(query);

    res.json({
      success: true,
      data: {
        products,
        pagination: { page: parseInt(page), limit: parseInt(limit), total, totalPages: Math.ceil(total / limit) }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, error: 'المنتج غير موجود' });
    }
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create order
router.post('/order',
  auth,
  async (req, res) => {
    try {
      const { items, paymentMethod } = req.body;
      const user = await User.findById(req.user.id);

      let total = 0;
      for (const item of items) {
        const product = await Product.findById(item.product);
        if (!product) {
          return res.status(400).json({ success: false, error: `المنتج ${item.product} غير موجود` });
        }
        total += product.price * item.quantity;
      }

      if (paymentMethod === 'points' && user.pointsBalance < total) {
        return res.status(400).json({ success: false, error: 'رصيدك غير كافٍ' });
      }

      // Deduct points
      if (paymentMethod === 'points') {
        user.pointsBalance -= total;
        await user.save();
      }

      const order = await Order.create({
        user: user._id,
        items: items.map(item => ({
          product: item.product,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        })),
        total,
        paymentMethod,
        status: 'pending'
      });

      res.status(201).json({ success: true, data: order });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
);

// Get user's orders
router.get('/orders/my',
  auth,
  async (req, res) => {
    try {
      const orders = await Order.find({ user: req.user.id })
        .populate('items.product')
        .sort({ createdAt: -1 });
      res.json({ success: true, data: orders });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
);

// Admin: Create product
router.post('/',
  auth,
  async (req, res) => {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ success: false, error: 'غير مصرح' });
      }
      const product = await Product.create(req.body);
      res.status(201).json({ success: true, data: product });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
);

// Admin: Update product
router.put('/:id',
  auth,
  async (req, res) => {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ success: false, error: 'غير مصرح' });
      }
      const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json({ success: true, data: product });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
);

// Admin: Delete product
router.delete('/:id',
  auth,
  async (req, res) => {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ success: false, error: 'غير مصرح' });
      }
      await Product.findByIdAndDelete(req.params.id);
      res.json({ success: true, message: 'تم حذف المنتج' });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
);

module.exports = router;
