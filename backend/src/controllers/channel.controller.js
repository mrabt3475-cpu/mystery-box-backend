// Channel Controller
const Channel = require('../models/Channel.model');
const { asyncHandler } = require('../middleware/error.middleware');
const config = require('../config/constants');

// @desc    Get all channels
// @route   GET /api/v1/channels
// @access  Public
exports.getChannels = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search, status = 'active' } = req.query;

  const query = { status };
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  const channels = await Channel.find(query)
    .populate('owner', 'name avatar')
    .sort('-stats.membersCount')
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  const total = await Channel.countDocuments(query);

  res.json({
    success: true,
    data: {
      channels,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    },
  });
});

// @desc    Get channel by ID
// @route   GET /api/v1/channels/:id
// @access  Public
exports.getChannel = asyncHandler(async (req, res) => {
  const channel = await Channel.findById(req.params.id)
    .populate('owner', 'name avatar');

  if (!channel) {
    return res.status(404).json({
      success: false,
      message: 'Channel not found',
    });
  }

  res.json({
    success: true,
    data: { channel },
  });
});

// @desc    Get channel by slug
// @route   GET /api/v1/channels/slug/:slug
// @access  Public
exports.getChannelBySlug = asyncHandler(async (req, res) => {
  const channel = await Channel.findOne({ slug: req.params.slug })
    .populate('owner', 'name avatar');

  if (!channel) {
    return res.status(404).json({
      success: false,
      message: 'Channel not found',
    });
  }

  res.json({
    success: true,
    data: { channel },
  });
});

// @desc    Create channel
// @route   POST /api/v1/channels
// @access  Private
exports.createChannel = asyncHandler(async (req, res) => {
  const { name, description, category, logo, banner } = req.body;

  // Generate slug from name
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  const channel = await Channel.create({
    name,
    slug,
    description,
    category,
    logo,
    banner,
    owner: req.user.id,
    members: [{ user: req.user.id, role: 'owner' }],
  });

  res.status(201).json({
    success: true,
    message: 'Channel created successfully',
    data: { channel },
  });
});

// @desc    Update channel
// @route   PUT /api/v1/channels/:id
// @access  Private
exports.updateChannel = asyncHandler(async (req, res) => {
  const channel = await Channel.findById(req.params.id);

  if (!channel) {
    return res.status(404).json({
      success: false,
      message: 'Channel not found',
    });
  }

  // Check ownership
  const isOwner = channel.owner.toString() === req.user.id;
  const isAdmin = req.user.role === 'admin';

  if (!isOwner && !isAdmin) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to update this channel',
    });
  }

  const updatedChannel = await Channel.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  res.json({
    success: true,
    message: 'Channel updated successfully',
    data: { channel: updatedChannel },
  });
});

// @desc    Delete channel
// @route   DELETE /api/v1/channels/:id
// @access  Private
exports.deleteChannel = asyncHandler(async (req, res) => {
  const channel = await Channel.findById(req.params.id);

  if (!channel) {
    return res.status(404).json({
      success: false,
      message: 'Channel not found',
    });
  }

  // Check ownership only
  if (channel.owner.toString() !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'Only the owner can delete this channel',
    });
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
exports.joinChannel = asyncHandler(async (req, res) => {
  const channel = await Channel.findById(req.params.id);

  if (!channel) {
    return res.status(404).json({
      success: false,
      message: 'Channel not found',
    });
  }

  // Check if already a member
  const isMember = channel.members.find(
    (m) => m.user.toString() === req.user.id
  );

  if (isMember) {
    return res.status(400).json({
      success: false,
      message: 'Already a member of this channel',
    });
  }

  channel.members.push({ user: req.user.id, role: 'member' });
  channel.stats.membersCount = channel.members.length;
  await channel.save();

  res.json({
    success: true,
    message: 'Joined channel successfully',
  });
});

// @desc    Leave channel
// @route   POST /api/v1/channels/:id/leave
// @access  Private
exports.leaveChannel = asyncHandler(async (req, res) => {
  const channel = await Channel.findById(req.params.id);

  if (!channel) {
    return res.status(404).json({
      success: false,
      message: 'Channel not found',
    });
  }

  // Check if owner
  if (channel.owner.toString() === req.user.id) {
    return res.status(400).json({
      success: false,
      message: 'Owner cannot leave the channel',
    });
  }

  channel.members = channel.members.filter(
    (m) => m.user.toString() !== req.user.id
  );
  channel.stats.membersCount = channel.members.length;
  await channel.save();

  res.json({
    success: true,
    message: 'Left channel successfully',
  });
});

// @desc    Get channel members
// @route   GET /api/v1/channels/:id/members
// @access  Public
exports.getMembers = asyncHandler(async (req, res) => {
  const channel = await Channel.findById(req.params.id)
    .populate('members.user', 'name avatar stats');

  if (!channel) {
    return res.status(404).json({
      success: false,
      message: 'Channel not found',
    });
  }

  res.json({
    success: true,
    data: { members: channel.members },
  });
});

// @desc    Get channel products
// @route   GET /api/v1/channels/:id/products
// @access  Public
exports.getProducts = asyncHandler(async (req, res) => {
  const Product = require('../models/Product.model');
  const products = await Product.find({ channel: req.params.id, status: 'active' })
    .sort('-stats.purchases');

  res.json({
    success: true,
    data: { products },
  });
});

// @desc    Get channel boxes
// @route   GET /api/v1/channels/:id/boxes
// @access  Public
exports.getBoxes = asyncHandler(async (req, res) => {
  const Box = require('../models/Box.model');
  const boxes = await Box.find({ channel: req.params.id, status: 'active' })
    .sort('-stats.totalOpens');

  res.json({
    success: true,
    data: { boxes },
  });
});

// @desc    Get channel streams
// @route   GET /api/v1/channels/:id/streams
// @access  Public
exports.getStreams = asyncHandler(async (req, res) => {
  const LiveStream = require('../models/LiveStream.model');
  const streams = await LiveStream.find({ channel: req.params.id })
    .sort('-startedAt')
    .limit(10);

  res.json({
    success: true,
    data: { streams },
  });
});
