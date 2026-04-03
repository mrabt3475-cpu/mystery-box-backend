// Order Controller
const Order = require('../models/Order.model');
const Product = require('../models/Product.model');
const User = require('../models/User.model');
const { asyncHandler, AppError } = require('../middleware/error.middleware');
const config = require('../../config/constants');

// @desc    Get user orders
// @route   GET /api/v1/orders
// @access  Private
const getOrders = asyncHandler(async (req, res, next) => {
  const { page = 1, limit = 10, status } = req.query;

  const query = { user: req.user.id };
  if (status) query.status = status;

  const orders = await Order.find(query)
    .populate('items.product', 'name image')
    .populate('channel', 'name logo')
    .sort('-createdAt')
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  const total = await Order.countDocuments(query);

  res.json({
    success: true,
    data: orders,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

// @desc    Get single order
// @route   GET /api/v1/orders/:id
// @access  Private
const getOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findOne({ _id: req.params.id, user: req.user.id })
    .populate('items.product', 'name image description')
    .populate('channel', 'name logo');

  if (!order) {
    return next(new AppError('Order not found', 404));
  }

  res.json({
    success: true,
    data: order,
  });
});

// @desc    Create order
// @route   POST /api/v1/orders
// @access  Private
const createOrder = asyncHandler(async (req, res, next) => {
  const { items, channel, coupon, pointsToUse } = req.body;

  if (!items || items.length === 0) {
    return next(new AppError('No items in order', 400));
  }

  // Calculate totals
  let subtotal = 0;
  const orderItems = [];

  for (const item of items) {
    const product = await Product.findById(item.productId);
    if (!product) {
      return next(new AppError(`Product ${item.productId} not found`, 404));
    }
    if (product.status !== 'active') {
      return next(new AppError(`Product ${product.name} is not available`, 400));
    }
    if (product.stock === 0) {
      return next(new AppError(`Product ${product.name} is out of stock`, 400));
    }

    orderItems.push({
      product: product._id,
      name: product.name,
      price: product.price,
      quantity: item.quantity || 1,
      image: product.images[0]?.url,
    });

    subtotal += product.price * (item.quantity || 1);
  }

  // Apply coupon discount
  let discount = 0;
  if (coupon) {
    // Coupon logic would go here
    discount = 0;
  }

  // Apply points
  let pointsUsed = 0;
  if (pointsToUse && pointsToUse > 0) {
    const user = await User.findById(req.user.id);
    if (pointsToUse > user.wallet.points) {
      return next(new AppError('Insufficient points', 400));
    }
    pointsUsed = pointsToUse;
    discount += pointsUsed * 0.01; // 1 point = $0.01
  }

  const total = Math.max(0, subtotal - discount);

  // Calculate points earned
  const pointsEarned = Order.calculatePointsEarned(total);

  const order = await Order.create({
    user: req.user.id,
    channel,
    items: orderItems,
    subtotal,
    discount,
    total,
    pointsUsed,
    pointsEarned,
    customer: {
      email: req.user.email,
      name: req.user.name,
    },
  });

  // Update product stats
  for (const item of orderItems) {
    await Product.incrementPurchases(item.product, item.price * item.quantity);
  }

  // Update user points and stats
  await User.findByIdAndUpdate(req.user.id, {
    $inc: {
      'wallet.points': pointsEarned - pointsUsed,
      'stats.totalOrders': 1,
      'stats.totalSpent': total,
    },
  });

  res.status(201).json({
    success: true,
    data: order,
  });
});

// @desc    Cancel order
// @route   PUT /api/v1/orders/:id/cancel
// @access  Private
const cancelOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findOne({ _id: req.params.id, user: req.user.id });

  if (!order) {
    return next(new AppError('Order not found', 404));
  }

  if (![config.ORDER_STATUS.PENDING, config.ORDER_STATUS.PROCESSING].includes(order.status)) {
    return next(new AppError('Cannot cancel this order', 400));
  }

  order.status = config.ORDER_STATUS.CANCELLED;
  await order.save();

  // Refund points if used
  if (order.pointsUsed > 0) {
    await User.findByIdAndUpdate(req.user.id, {
      $inc: { 'wallet.points': order.pointsUsed },
    });
  }

  res.json({
    success: true,
    message: 'Order cancelled successfully',
  });
});

module.exports = {
  getOrders,
  getOrder,
  createOrder,
  cancelOrder,
};
