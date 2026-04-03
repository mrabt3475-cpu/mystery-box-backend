// Channel Controller
const Channel = require('../models/Channel.model');
const { asyncHandler, AppError } = require('../middleware/error.middleware');
const config = require('../../config/constants');

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
    .populate('owner', 'name email avatar')
    .sort('-createdAt')
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
    .populate('owner', 'name email avatar')
    .populate('members.user', 'name email avatar');

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
  const { name, description, category, isPrivate } = req.body;

  // Check if name exists
  const existingChannel = await Channel.findOne({ name });
  if (existingChannel) {
    return next(new AppError('Channel name already exists', 400));
  }

  const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

  const channel = await Channel.create({
    name,
    slug,
    description,
    category,
    isPrivate,
    owner: req.user.id,
    members: [{ user: req.user.id, role: 'owner' }],
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
  const channel = await Channel.findById(req.params.id);

  if (!channel) {
    return next(new AppError('Channel not found', 404));
  }

  // Check ownership
  const isOwner = channel.owner.toString() === req.user.id;
  const isAdmin = req.user.role === 'admin';

  if (!isOwner && !isAdmin) {
    return next(new AppError('Not authorized to update this channel', 403));
  }

  const allowedFields = ['name', 'description', 'category', 'logo', 'banner', 'settings'];
  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      channel[field] = req.body[field];
    }
  });

  await channel.save();

  res.json({
    success: true,
    data: channel,
  });
});

// @desc    Delete channel
// @route   DELETE /api/v1/channels/:id
// @access  Private (Owner only)
const deleteChannel = asyncHandler(async (req, res, next) => {
  const channel = await Channel.findById(req.params.id);

  if (!channel) {
    return next(new AppError('Channel not found', 404));
  }

  if (channel.owner.toString() !== req.user.id) {
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

  if (channel.isPrivate) {
    return next(new AppError('This channel is private', 403));
  }

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
