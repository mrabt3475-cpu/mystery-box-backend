// Product Controller
const Product = require('../models/Product.model');
const { asyncHandler } = require('../middleware/error.middleware');

// @desc    Get all products
// @route   GET /api/v1/products
// @access  Public
exports.getProducts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 12, channel, category, minPrice, maxPrice, sort = '-createdAt' } = req.query;

  const query = { status: 'active' };

  if (channel) query.channel = channel;
  if (category) query.category = category;
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = minPrice;
    if (maxPrice) query.price.$lte = maxPrice;
  }

  const products = await Product.find(query)
    .populate('channel', 'name slug logo')
    .populate('category', 'name slug')
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  const total = await Product.countDocuments(query);

  res.json({
    success: true,
    data: {
      products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    },
  });
});

// @desc    Get product by ID
// @route   GET /api/v1/products/:id
// @access  Public
exports.getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
    .populate('channel', 'name slug logo')
    .populate('category', 'name slug');

  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found',
    });
  }

  // Increment views
  await Product.incrementViews(req.params.id);

  res.json({
    success: true,
    data: { product },
  });
});

// @desc    Create product
// @route   POST /api/v1/products
// @access  Private
exports.createProduct = asyncHandler(async (req, res) => {
  const Channel = require('../models/Channel.model');
  const { name, description, price, originalPrice, channel: channelId, category, images, type, stock, tags, features, isFree, pointsPrice } = req.body;

  // Verify channel ownership
  const channel = await Channel.findById(channelId);
  if (!channel) {
    return res.status(404).json({
      success: false,
      message: 'Channel not found',
    });
  }

  const isOwner = channel.owner.toString() === req.user.id;
  const isAdmin = req.user.role === 'admin';

  if (!isOwner && !isAdmin) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to create products in this channel',
    });
  }

  const product = await Product.create({
    name,
    description,
    price,
    originalPrice,
    channel: channelId,
    category,
    images,
    type,
    stock,
    tags,
    features,
    isFree,
    pointsPrice,
  });

  // Update channel stats
  await Channel.findByIdAndUpdate(channelId, {
    $inc: { 'stats.totalProducts': 1 },
  });


  res.status(201).json({
    success: true,
    message: 'Product created successfully',
    data: { product },
  });
});

// @desc    Update product
// @route   PUT /api/v1/products/:id
// @access  Private
exports.updateProduct = asyncHandler(async (req, res) => {
  const Channel = require('../models/Channel.model');
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found',
    });
  }

  // Verify channel ownership
  const channel = await Channel.findById(product.channel);
  const isOwner = channel.owner.toString() === req.user.id;
  const isAdmin = req.user.role === 'admin';

  if (!isOwner && !isAdmin) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to update this product',
    });
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  res.json({
    success: true,
    message: 'Product updated successfully',
    data: { product: updatedProduct },
  });
});

// @desc    Delete product
// @route   DELETE /api/v1/products/:id
// @access  Private
exports.deleteProduct = asyncHandler(async (req, res) => {
  const Channel = require('../models/Channel.model');
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found',
    });
  }

  // Verify channel ownership
  const channel = await Channel.findById(product.channel);
  const isOwner = channel.owner.toString() === req.user.id;
  const isAdmin = req.user.role === 'admin';

  if (!isOwner && !isAdmin) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to delete this product',
    });
  }

  await product.deleteOne();

  // Update channel stats
  await Channel.findByIdAndUpdate(product.channel, {
    $inc: { 'stats.totalProducts': -1 },
  });

  res.json({
    success: true,
    message: 'Product deleted successfully',
  });
});

// @desc    Get featured products
// @route   GET /api/v1/products/featured
// @access  Public
exports.getFeaturedProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ isFeatured: true, status: 'active' })
    .populate('channel', 'name slug logo')
    .limit(12);

  res.json({
    success: true,
    data: { products },
  });
});

// @desc    Search products
// @route   GET /api/v1/products/search
// @access  Public
exports.searchProducts = asyncHandler(async (req, res) => {
  const { q, limit = 20 } = req.query;

  if (!q) {
    return res.status(400).json({
      success: false,
      message: 'Search query is required',
    });
  }

  const products = await Product.find(
    { $text: { $search: q }, status: 'active' },
    { score: { $meta: 'textScore' } }
  )
    .sort({ score: { $meta: 'textScore' } })
    .limit(parseInt(limit))
    .populate('channel', 'name slug logo');

  res.json({
    success: true,
    data: { products },
  });
});

// @desc    Get products by category
// @route   GET /api/v1/products/category/:categoryId
// @access  Public
exports.getProductsByCategory = asyncHandler(async (req, res) => {
  const products = await Product.find({
    category: req.params.categoryId,
    status: 'active',
  })
    .populate('channel', 'name slug logo')
    .sort('-stats.purchases');

  res.json({
    success: true,
    data: { products },
  });
});
