// Product Controller
const Product = require('../models/Product.model');
const { asyncHandler, AppError } = require('../middleware/error.middleware');

// @desc    Get all products
// @route   GET /api/v1/products
// @access  Public
const getProducts = asyncHandler(async (req, res, next) => {
  const { 
    page = 1, 
    limit = 12, 
    search, 
    category, 
    channel,
    minPrice,
    maxPrice,
    sort = '-createdAt',
    status = 'active'
  } = req.query;

  const query = { status };
  
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }
  if (category) query.category = category;
  if (channel) query.channel = channel;
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = parseFloat(minPrice);
    if (maxPrice) query.price.$lte = parseFloat(maxPrice);
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
    data: products,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

// @desc    Get single product
// @route   GET /api/v1/products/:id
// @access  Public
const getProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id)
    .populate('channel', 'name slug logo owner')
    .populate('category', 'name slug');

  if (!product) {
    return next(new AppError('Product not found', 404));
  }

  // Increment views
  await Product.incrementViews(product._id);

  res.json({
    success: true,
    data: product,
  });
});

// @desc    Create product
// @route   POST /api/v1/products
// @access  Private
const createProduct = asyncHandler(async (req, res, next) => {
  const productData = {
    ...req.body,
    channel: req.body.channel || req.user.channel,
  };

  const product = await Product.create(productData);

  res.status(201).json({
    success: true,
    data: product,
  });
});

// @desc    Update product
// @route   PUT /api/v1/products/:id
// @access  Private
const updateProduct = asyncHandler(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new AppError('Product not found', 404));
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.json({
    success: true,
    data: product,
  });
});

// @desc    Delete product
// @route   DELETE /api/v1/products/:id
// @access  Private
const deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new AppError('Product not found', 404));
  }

  await product.deleteOne();

  res.json({
    success: true,
    message: 'Product deleted successfully',
  });
});

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
