const express = require('express');
const router = express.Router();
const Product = require('../models/Product.model');
const Order = require('../models/Order.model');
const User = require('../models/user.model');
const PointsTransaction = require('../models/pointsTransaction.model');
const { auth } = require('../middleware/auth.middleware');
const { catchAsync } = require('../middleware/errorHandler.middleware');
const { validators } = require('../utils/validation');
const { NotFoundError, ValidationError } = require('../utils/AppError');
const { formatSuccess, formatPaginated } = require('../utils/responseFormatter');

// Get all products with pagination
router.get('/', catchAsync(async (req, res) => {
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
    .skip((parseInt(page) - 1) * parseInt(limit))
    .limit(parseInt(limit));
    
  const total = await Product.countDocuments(query);
  
  res.json(formatPaginated(products, { page: parseInt(page), limit: parseInt(limit), total }));
}));

// Get single product
router.get('/:id', validators.isObjectId('id'), catchAsync(async (req, res) => {
  const product = await Product.findById(req.params.id);
  
  if (!product) {
    throw new NotFoundError('المنتج');
  }
  
  res.json(formatSuccess(product));
}));

// Create order
router.post('/order', auth, catchAsync(async (req, res) => {
  const { items, paymentMethod } = req.body;
  
  if (!items || !Array.isArray(items) || items.length === 0) {
    throw new ValidationError('يجب إضافة منتجات للطلب');
  }
  
  const user = await User.findById(req.user.id);
  let total = 0;
  
  for (const item of items) {
    const product = await Product.findById(item.product);
    if (!product) {
      throw new NotFoundError(`المنتج: ${item.product}`);
    }
    total += product.price * item.quantity;
  }

  if (paymentMethod === 'points' && user.pointsBalance < total) {
    throw new ValidationError('رصيدك غير كافٍ');
  }

  if (paymentMethod === 'points') {
    user.pointsBalance -= total;
    user.lifetimePoints += Math.floor(total * 0.05);
    await user.save();
    
    await PointsTransaction.create({
      user: req.user.id,
      amount: -total,
      type: 'purchase',
      description: 'شراء منتج',
      balanceAfter: user.pointsBalance
    });
  }

  const order = await Order.create({
    user: req.user.id,
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

  res.status(201).json(formatSuccess(order, '✅ تم إنشاء الطلب'));
}));

// Get user's orders
router.get('/orders/my', auth, catchAsync(async (req, res) => {
  const orders = await Order.find({ user: req.user.id })
    .populate('items.product')
    .sort({ createdAt: -1 });
  
  res.json(formatSuccess(orders));
}));

// Admin: Create product
router.post('/', auth, catchAsync(async (req, res) => {
  if (req.user.role !== 'admin') {
    throw new ValidationError('غير مصرح لك');
  }
  
  const product = await Product.create(req.body);
  res.status(201).json(formatSuccess(product, '✅ تم إنشاء المنتج'));
}));

// Admin: Update product
router.put('/:id', auth, validators.isObjectId('id'), catchAsync(async (req, res) => {
  if (req.user.role !== 'admin') {
    throw new ValidationError('غير مصرح لك');
  }
  
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  
  if (!product) {
    throw new NotFoundError('المنتج');
  }
  
  res.json(formatSuccess(product, '✅ تم تحديث المنتج'));
}));

// Admin: Delete product
router.delete('/:id', auth, validators.isObjectId('id'), catchAsync(async (req, res) => {
  if (req.user.role !== 'admin') {
    throw new ValidationError('غير مصرح لك');
  }
  
  const product = await Product.findByIdAndDelete(req.params.id);
  
  if (!product) {
    throw new NotFoundError('المنتج');
  }
  
  res.json(formatSuccess(null, '✅ تم حذف المنتج'));
}));

module.exports = router;
