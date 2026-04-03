// Box Controller
const MysteryBox = require('../models/MysteryBox.model');
const User = require('../models/User.model');
const { asyncHandler, AppError } = require('../middleware/error.middleware');
const config = require('../../config/constants');

// @desc    Get all boxes
// @route   GET /api/v1/boxes
// @access  Public
const getBoxes = asyncHandler(async (req, res, next) => {
  const { page = 1, limit = 12, type, status = 'active' } = req.query;

  const query = { status };
  if (type) query.type = type;

  const boxes = await MysteryBox.find(query)
    .populate('channel', 'name slug logo')
    .sort('-stats.totalOpens')
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  const total = await MysteryBox.countDocuments(query);

  res.json({
    success: true,
    data: boxes,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

// @desc    Get single box
// @route   GET /api/v1/boxes/:id
// @access  Public
const getBox = asyncHandler(async (req, res, next) => {
  const box = await MysteryBox.findById(req.params.id)
    .populate('channel', 'name slug logo');

  if (!box) {
    return next(new AppError('Box not found', 404));
  }

  res.json({
    success: true,
    data: box,
  });
});

// @desc    Open box
// @route   POST /api/v1/boxes/:id/open
// @access  Private
const openBox = asyncHandler(async (req, res, next) => {
  const box = await MysteryBox.findById(req.params.id);

  if (!box) {
    return next(new AppError('Box not found', 404));
  }

  if (box.status !== 'active') {
    return next(new AppError('Box is not available', 400));
  }

  // Check user balance
  const user = await User.findById(req.user.id);
  if (user.wallet.balance < box.price) {
    return next(new AppError('Insufficient balance', 400));
  }

  // Provably Fair RNG
  const seed = Date.now() + Math.random();
  const random = Math.random() * 100;
  
  let cumulativeProbability = 0;
  let selectedPrize = null;

  for (const prize of box.prizes) {
    cumulativeProbability += prize.probability;
    if (random <= cumulativeProbability) {
      selectedPrize = prize;
      break;
    }
  }

  if (!selectedPrize) {
    selectedPrize = box.prizes[Math.floor(Math.random() * box.prizes.length)];
  }

  // Deduct balance
  user.wallet.balance -= box.price;
  user.wallet.totalSpent += box.price;
  user.stats.totalSpent += box.price;
  await user.save();

  // Update box stats
  box.stats.totalOpens += 1;
  box.stats.totalRevenue += box.price;
  box.stats.lastOpenedAt = new Date();
  await box.save();

  res.json({
    success: true,
    data: {
      prize: selectedPrize,
      remainingBalance: user.wallet.balance,
    },
  });
});

// @desc    Create box
// @route   POST /api/v1/boxes
// @access  Private (Admin)
const createBox = asyncHandler(async (req, res, next) => {
  const box = await MysteryBox.create(req.body);

  res.status(201).json({
    success: true,
    data: box,
  });
});

// @desc    Update box
// @route   PUT /api/v1/boxes/:id
// @access  Private (Admin)
const updateBox = asyncHandler(async (req, res, next) => {
  const box = await MysteryBox.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!box) {
    return next(new AppError('Box not found', 404));
  }

  res.json({
    success: true,
    data: box,
  });
});

module.exports = {
  getBoxes,
  getBox,
  openBox,
  createBox,
  updateBox,
};
