const express = require('express');
const router = express.Router();
const Product = require('../models/Product.model');
const Order = require('../models/Order.model');
const User = require('../models/user.model');
const PointsTransaction = require('../models/pointsTransaction.model');
const searchService = require('../services/search.service');
const pricingService = require('../services/pricing.service');
const { auth } = require('../middleware/auth.middleware');
const { catchAsync } = require('../middleware/errorHandler.middleware');
const { validators } = require('../utils/validation');
const { NotFoundError, ValidationError } = require('../utils/AppError');
const { formatSuccess, formatPaginated } = require('../utils/responseFormatter');
const { logger } = require('../utils/logger');

// Get all products with advanced filters
router.get('/', catchAsync(async (req, res) => {
  const { 
    page = 1, 
    limit = 20, 
    category, 
    search,
    minPrice,
    maxPrice,
    inStock,
    sort,
    tags
  } = req.query;

  // Use enhanced search if any advanced filters
  if (search || minPrice || maxPrice || inStock === 'true' || tags) {
    const result = await searchService.searchProducts({
      query: search,
      category,
      minPrice: minPrice ? parseFloat(minPrice) : null,
      maxPrice: maxPrice ? parseFloat(maxPrice) : null,
      inStock: inStock === 'true',
      sortBy: sort,
      page: parseInt(page),
      limit: parseInt(limit),
      tags: tags ? tags.split(',') : []
    });
    
    return res.json(formatPaginated(
      result.products, 
      { page: parseInt(page), limit: parseInt(limit), total: result.pagination.total }
    ));
  }

  // Original simple query
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

// Get single product with pricing
router.get('/:id', validators.isObjectId('id'), catchAsync(async (req, res) => {
  const product = await Product.findById(req.params.id);
  
  if (!product) {
    throw new NotFoundError('المنتج');
  }
  
  // Add pricing info
  const productWithPricing = {
    ...product.toObject(),
    profitMargin: pricingService.calculateProfitMargin(product.price, product.costPrice),
    hasDiscount: product.originalPrice && product.originalPrice > product.price,
    discountPercent: product.originalPrice 
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0
  };
  
  res.json(formatSuccess(productWithPricing));
}));

// Create order - WITH PROPER VALIDATION
router.post('/order', auth, catchAsync(async (req, res) => {
  const { items, paymentMethod } = req.body;
  
  // Validate items
  if (!items || !Array.isArray(items) || items.length === 0) {
    throw new ValidationError('يجب إضافة منتج واحد على الأقل');
  }

  // Validate each item
  for (const item of items) {
    if (!item.product || !item.quantity || item.quantity < 1) {
      throw new ValidationError('بيانات المنتج غير صالحة');
    }
  }

  const user = await User.findById(req.user.id);
  let total = 0;
  
  // Calculate total and validate products
  for (const item of items) {
    const product = await Product.findById(item.product);
    if (!product) {
      throw new NotFoundError(`المنتج: ${item.product}`);
    }
    if (!product.isActive) {
      throw new ValidationError(`المنتج ${product.name} غير متاح`);
    }
    if (product.stock < item.quantity) {
      throw new ValidationError(`المخزون غير كافٍ للمنتج ${product.name}`);
    }
    total += product.price * item.quantity;
  }

  // Validate payment method
  const validPaymentMethods = ['points', 'stripe', 'ton', 'wallet'];
  if (!paymentMethod || !validPaymentMethods.includes(paymentMethod)) {
    throw new ValidationError('طريقة دفع غير صالحة');
  }

  // Check balance for points payment
  if (paymentMethod === 'points') {
    if (user.pointsBalance < total) {
      throw new ValidationError('رصيدك غير كافٍ');
    }

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

    logger.info(`Order created for user ${req.user.id}, amount: ${total} points`);
  }

  // Update stock
  for (const item of items) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: -item.quantity }
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

  res.status(201).json(formatSuccess(order, '✅ تم إنشاء الطلب بنجاح'));
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
    throw new ValidationError('غير مصرح');
  }
  
  const { name, price, description } = req.body;
  
  if (!name || !price) {
    throw new ValidationError('الاسم والسعر مطلوبان');
  }
  
  const product = await Product.create(req.body);
  res.status(201).json(formatSuccess(product, '✅ تم إضافة المنتج'));
}));

// Admin: Update product
router.put('/:id', auth, validators.isObjectId('id'), catchAsync(async (req, res) => {
  if (req.user.role !== 'admin') {
    throw new ValidationError('غير مصرح');
  }
  
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  
  if (!product) {
    throw new NotFoundError('المنتج');
  }
  
  res.json(formatSuccess(product, '✅ تم تحديث المنتج'));
}));

// Admin: Delete product
router.delete('/:id', auth, validators.isObjectId('id'), catchAsync(async (req, res) => {
  if (req.user.role !== 'admin') {
    throw new ValidationError('غير مصرح');
  }
  
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { isActive: false },
    { new: true }
  );
  
  if (!product) {
    throw new NotFoundError('المنتج');
  }
  
  res.json(formatSuccess(null, '✅ تم حذف المنتج'));
}));

// Admin: Bulk import products
router.post('/bulk-import', auth, catchAsync(async (req, res) => {
  if (req.user.role !== 'admin') {
    throw new ValidationError('غير مصرح');
  }
  
  const { products } = req.body;
  
  if (!Array.isArray(products) || products.length === 0) {
    throw new ValidationError('قائمة المنتجات فارغة');
  }

  const inserted = await Product.insertMany(products);
  
  res.status(201).json(formatSuccess({
    count: inserted.length,
    products: inserted
  }, `✅ تم استيراد ${inserted.length} منتج`));
}));

module.exports = router;