// Order Controller
const Order = require('../models/Order.model');
const Product = require('../models/Product.model');
const User = require('../models/User.model');
const Coupon = require('../models/Coupon.model');
const { asyncHandler } = require('../middleware/error.middleware');

// @desc    Get user orders
// @route   GET /api/v1/orders
// @access  Private
exports.getOrders = asyncHandler(async (req, res) => {
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
    data: {
      orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    },
  });
});

// @desc    Get order by ID
// @route   GET /api/v1/orders/:id
// @access  Private
exports.getOrder = asyncHandler(async (req, res) => {
  const order = await Order.findOne({
    _id: req.params.id,
    user: req.user.id,
  })
    .populate('items.product', 'name image type')
    .populate('channel', 'name logo');

  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found',
    });
  }

  res.json({
    success: true,
    data: { order },
  });
});

// @desc    Create new order
// @route   POST /api/v1/orders
// @access  Private
exports.createOrder = asyncHandler(async (req, res) => {
  const { items, channel, couponCode, notes } = req.body;

  // Get product details and calculate total
  let subtotal = 0;
  const orderItems = [];

  for (const item of items) {
    const product = await Product.findById(item.product);
    if (!product || product.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: `Product ${item.product} not found or unavailable`,
      });
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
  if (couponCode) {
    const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });
    if (coupon) {
      const validation = coupon.validate(subtotal, req.user.id, 0);
      if (validation.valid) {
        discount = validation.discount;
      }
    }
  }

  const total = subtotal - discount;

  // Generate order number
  const orderNumber = await Order.generateOrderNumber();

  const order = await Order.create({
    orderNumber,
    user: req.user.id,
    channel,
    items: orderItems,
    subtotal,
    discount,
    total,
    notes,
    ipAddress: req.ip,
    userAgent: req.get('user-agent'),
  });

  res.status(201).json({
    success: true,
    message: 'Order created successfully',
    data: { order },
  });
});

// @desc    Cancel order
// @route   PUT /api/v1/orders/:id/cancel
// @access  Private
exports.cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findOne({
    _id: req.params.id,
    user: req.user.id,
  });

  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found',
    });
  }

  if (order.status !== 'pending' && order.status !== 'processing') {
    return res.status(400).json({
      success: false,
      message: 'Cannot cancel this order',
    });
  }

  order.status = 'cancelled';
  await order.save();

  res.json({
    success: true,
    message: 'Order cancelled successfully',
  });
});

// @desc    Download order product
// @route   GET /api/v1/orders/:id/download
// @access  Private
exports.downloadProduct = asyncHandler(async (req, res) => {
  const order = await Order.findOne({
    _id: req.params.id,
    user: req.user.id,
    status: 'completed',
  });

  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found or not completed',
    });
  }

  // Return download links for digital products
  const downloads = order.items.map((item) => ({
    name: item.name,
    downloadUrl: `/api/v1/products/${item.product}/file`,
  }));

  res.json({
    success: true,
    data: { downloads },
  });
});
