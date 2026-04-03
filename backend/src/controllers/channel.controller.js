// Channel Controller
const Channel = require('../models/Channel.model');
const { asyncHandler, AppError } = require('../middleware/error.middleware');

// @desc    Get all channels
// @route   GET /api/v1/channels
// @access  Public
const getChannels = asyncHandler(async (req, res, next) => {
  const { page = 1, limit = 10, search, category, status = 'active' } = req.query;

  const query = { status };
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }
  if (category) query.category = category;

  const channels = await Channel.find(query)
    .populate('owner', 'name avatar')
    .sort('-stats.membersCount')
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  const total = await Channel.countDocuments(query);

  res.json({
    success: true,
    data: channels,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

// @desc    Get single channel
// @route   GET /api/v1/channels/:id
// @access  Public
const getChannel = asyncHandler(async (req, res, next) => {
  const channel = await Channel.findById(req.params.id)
    .populate('owner', 'name avatar')
    .populate('members.user', 'name avatar');

  if (!channel) {
    return next(new AppError('Channel not found', 404));
  }

  res.json({
    success: true,
    data: channel,
  });
});

// @desc    Create channel
// @route   POST /api/v1/channels
// @access  Private
const createChannel = asyncHandler(async (req, res, next) => {
  const { name, description, category, logo, banner, isPrivate } = req.body;

  // Generate slug from name
  const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');

  const channel = await Channel.create({
    name,
    slug,
    description,
    category,
    logo,
    banner,
    isPrivate,
    owner: req.user.id,
    members: [{ user: req.user.id, role: 'owner' }],
    stats: { membersCount: 1 },
  });

  res.status(201).json({
    success: true,
    data: channel,
  });
});

// @desc    Update channel
// @route   PUT /api/v1/channels/:id
// @access  Private (Owner/Admin)
const updateChannel = asyncHandler(async (req, res, next) => {
  const { name, description, category, logo, banner, isPrivate, settings } = req.body;

  let channel = await Channel.findById(req.params.id);

  if (!channel) {
    return next(new AppError('Channel not found', 404));
  }

  // Check ownership
  if (channel.owner.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new AppError('Not authorized to update this channel', 403));
  }

  channel = await Channel.findByIdAndUpdate(
    req.params.id,
    { name, description, category, logo, banner, isPrivate, settings },
    { new: true, runValidators: true }
  );

  res.json({
    success: true,
    data: channel,
  });
});

// @desc    Delete channel
// @route   DELETE /api/v1/channels/:id
// @access  Private (Owner)
const deleteChannel = asyncHandler(async (req, res, next) => {
  const channel = await Channel.findById(req.params.id);

  if (!channel) {
    return next(new AppError('Channel not found', 404));
  }

  if (channel.owner.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new AppError('Not authorized to delete this channel', 403));
  }

  await channel.deleteOne();

  res.json({
    success: true,
    message: 'Channel deleted successfully',
  });
});

// @desc    Join channel
// @route   POST /api/v1/channels/:id/join
// @access  Private
const joinChannel = asyncHandler(async (req, res, next) => {
  const channel = await Channel.findById(req.params.id);

  if (!channel) {
    return next(new AppError('Channel not found', 404));
  }

  // Check if already a member
  const isMember = channel.members.find(
    (m) => m.user.toString() === req.user.id
  );

  if (isMember) {
    return next(new AppError('Already a member of this channel', 400));
  }

  channel.members.push({ user: req.user.id, role: 'member' });
  channel.stats.membersCount = channel.members.length;
  await channel.save();

  res.json({
    success: true,
    message: 'Joined channel successfully',
  });
});

module.exports = {
  getChannels,
  getChannel,
  createChannel,
  updateChannel,
  deleteChannel,
  joinChannel,
};
