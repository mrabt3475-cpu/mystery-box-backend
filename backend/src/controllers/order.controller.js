// Order Controller
const Order = require('../models/Order.model');
const Product = require('../models/Product.model');
const User = require('../models/User.model');
const { asyncHandler, AppError } = require('../middleware/error.middleware');

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
  const order = await Order.findById(req.params.id)
    .populate('items.product', 'name image description')
    .populate('channel', 'name logo');

  if (!order) {
    return next(new AppError('Order not found', 404));
  }

  // Check ownership
  if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new AppError('Not authorized to view this order', 403));
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
  const { items, channel, paymentMethod, couponCode } = req.body;

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

    orderItems.push({
      product: product._id,
      name: product.name,
      price: product.price,
      quantity: item.quantity || 1,
      image: product.images[0]?.url,
    });

    subtotal += product.price * (item.quantity || 1);
  }

  // Apply coupon discount (simplified)
  let discount = 0;
  if (couponCode) {
    // Add coupon logic here
  }

  const total = subtotal - discount;

  const order = await Order.create({
    user: req.user.id,
    channel,
    items: orderItems,
    subtotal,
    discount,
    total,
    payment: {
      method: paymentMethod,
      status: 'pending',
    },
    customer: {
      email: req.user.email,
      name: req.user.name,
    },
  });

  res.status(201).json({
    success: true,
    data: order,
  });
});

// @desc    Update order status
// @route   PUT /api/v1/orders/:id/status
// @access  Private (Admin)
const updateOrderStatus = asyncHandler(async (req, res, next) => {
  const { status } = req.body;

  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new AppError('Order not found', 404));
  }

  order.status = status;
  await order.save();

  // Update product stats
  if (status === 'completed') {
    for (const item of order.items) {
      await Product.incrementPurchases(item.product, item.price * item.quantity);
    }

    // Add points to user
    const pointsEarned = Order.calculatePointsEarned(order.total);
    await User.findByIdAndUpdate(order.user, {
      $inc: { 'wallet.points': pointsEarned },
    });
  }

  res.json({
    success: true,
    data: order,
  });
});

module.exports = {
  getOrders,
  getOrder,
  createOrder,
  updateOrderStatus,
};
