// Box Controller
const Box = require('../models/Box.model');
const User = require('../models/User.model');
const Channel = require('../models/Channel.model');
const Order = require('../models/Order.model');
const { asyncHandler } = require('../middleware/error.middleware');
const config = require('../config/constants');

// @desc    Get all boxes
// @route   GET /api/v1/boxes
// @access  Public
exports.getBoxes = asyncHandler(async (req, res) => {
  const { page = 1, limit = 12, channel, type, minPrice, maxPrice, sort = '-stats.totalOpens' } = req.query;

  const query = { status: 'active' };
  if (channel) query.channel = channel;
  if (type) query.type = type;
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = minPrice;
    if (maxPrice) query.price.$lte = maxPrice;
  }

  const boxes = await Box.find(query)
    .populate('channel', 'name slug logo')
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  const total = await Box.countDocuments(query);

  res.json({
    success: true,
    data: {
      boxes,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    },
  });
});

// @desc    Get box by ID
// @route   GET /api/v1/boxes/:id
// @access  Public
exports.getBox = asyncHandler(async (req, res) => {
  const box = await Box.findById(req.params.id)
    .populate('channel', 'name slug logo');

  if (!box) {
    return res.status(404).json({
      success: false,
      message: 'Box not found',
    });
  }

  res.json({
    success: true,
    data: { box },
  });
});

// @desc    Create box
// @route   POST /api/v1/boxes
// @access  Private
exports.createBox = asyncHandler(async (req, res) => {
  const { name, description, price, pointsPrice, channel: channelId, image, type, prizes, settings, startDate, endDate, isFeatured } = req.body;

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
      message: 'Not authorized to create boxes in this channel',
    });
  }

  const box = await Box.create({
    name,
    description,
    price,
    pointsPrice,
    channel: channelId,
    image,
    type,
    prizes,
    settings,
    startDate,
    endDate,
    isFeatured,
  });


  res.status(201).json({
    success: true,
    message: 'Box created successfully',
    data: { box },
  });
});

// @desc    Update box
// @route   PUT /api/v1/boxes/:id
// @access  Private
exports.updateBox = asyncHandler(async (req, res) => {
  const box = await Box.findById(req.params.id);

  if (!box) {
    return res.status(404).json({
      success: false,
      message: 'Box not found',
    });
  }

  // Verify channel ownership
  const channel = await Channel.findById(box.channel);
  const isOwner = channel.owner.toString() === req.user.id;
  const isAdmin = req.user.role === 'admin';

  if (!isOwner && !isAdmin) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to update this box',
    });
  }

  const updatedBox = await Box.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  res.json({
    success: true,
    message: 'Box updated successfully',
    data: { box: updatedBox },
  });
});

// @desc    Delete box
// @route   DELETE /api/v1/boxes/:id
// @access  Private
exports.deleteBox = asyncHandler(async (req, res) => {
  const box = await Box.findById(req.params.id);

  if (!box) {
    return res.status(404).json({
      success: false,
      message: 'Box not found',
    });
  }

  // Verify channel ownership
  const channel = await Channel.findById(box.channel);
  const isOwner = channel.owner.toString() === req.user.id;
  const isAdmin = req.user.role === 'admin';

  if (!isOwner && !isAdmin) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to delete this box',
    });
  }

  await box.deleteOne();

  res.json({
    success: true,
    message: 'Box deleted successfully',
  });
});

// @desc    Open a box
// @route   POST /api/v1/boxes/:id/open
// @access  Private
exports.openBox = asyncHandler(async (req, res) => {
  const box = await Box.findById(req.params.id);

  if (!box || box.status !== 'active') {
    return res.status(404).json({
      success: false,
      message: 'Box not found or unavailable',
    });
  }

  // Check if user has enough balance/points
  const user = await User.findById(req.user.id);

  if (box.pointsPrice > 0) {
    // Using points
    if (user.wallet.points < box.pointsPrice) {
      return res.status(400).json({
        success: false,
        message: 'Not enough points',
      });
    }
    user.wallet.points -= box.pointsPrice;
  } else {
    // Using money
    if (user.wallet.balance < box.price) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient balance',
      });
    }
    user.wallet.balance -= box.price;
  }

  // Select prize
  const prize = box.selectPrize();

  // Update box stats
  box.stats.totalOpens += 1;
  box.stats.totalRevenue += box.price;
  box.stats.todayOpens += 1;
  await box.save();

  // Update user stats
  user.wallet.points += Math.floor(prize.value * 0.1); // 10% cashback in points
  user.stats.totalSpent += box.price;
  await user.save();

  // Emit socket event if in a channel
  const io = req.app.get('io');
  if (io && box.channel) {
    io.to(`channel_${box.channel}`).emit('box_opened', {
      user: { id: user._id, name: user.name },
      box: { id: box._id, name: box.name },
      prize,
    });
  }

  res.json({
    success: true,
    message: 'Box opened successfully!',
    data: {
      prize,
      newBalance: user.wallet.balance,
      newPoints: user.wallet.points,
    },
  });
});

// @desc    Get box prizes
// @route   GET /api/v1/boxes/:id/prizes
// @access  Public
exports.getBoxPrizes = asyncHandler(async (req, res) => {
  const box = await Box.findById(req.params.id).select('prizes');

  if (!box) {
    return res.status(404).json({
      success: false,
      message: 'Box not found',
    });
  }

  res.json({
    success: true,
    data: { prizes: box.prizes },
  });
});

// @desc    Get featured boxes
// @route   GET /api/v1/boxes/featured
// @access  Public
exports.getFeaturedBoxes = asyncHandler(async (req, res) => {
  const boxes = await Box.find({ isFeatured: true, status: 'active' })
    .populate('channel', 'name slug logo')
    .limit(12);

  res.json({
    success: true,
    data: { boxes },
  });
});
