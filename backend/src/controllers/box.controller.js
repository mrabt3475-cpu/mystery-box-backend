// Box Controller - Mystery Box System
const MysteryBox = require('../models/MysteryBox.model');
const User = require('../models/User.model');
const { asyncHandler, AppError } = require('../middleware/error.middleware');
const crypto = require('crypto');

// Provably Fair RNG - Server Seed
const generateServerSeed = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Generate hash for verification
const generateHash = (serverSeed, clientSeed, nonce) => {
  return crypto
    .createHash('sha256')
    .update(`${serverSeed}-${clientSeed}-${nonce}`)
    .digest('hex');
};

// Determine prize based on hash
const determinePrize = (hash, prizes) => {
  const hashNum = parseInt(hash.substring(0, 8), 16);
  const random = hashNum / 0xffffffff;
  
  let cumulative = 0;
  for (const prize of prizes) {
    cumulative += prize.probability / 100;
    if (random <= cumulative) {
      return prize;
    }
  }
  return prizes[0]; // Default to first prize
}

// @desc    Get all boxes
// @route   GET /api/v1/boxes
// @access  Public
const getBoxes = asyncHandler(async (req, res, next) => {
  const { page = 1, limit = 12, type, status = 'active' } = req.query;

  const query = { status };
  if (type) query.type = type;

  const boxes = await MysteryBox.find(query)
    .populate('channel', 'name logo')
    .sort('-createdAt')
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
    .populate('channel', 'name logo owner');

  if (!box) {
    return next(new AppError('Box not found', 404));
  }

  // Hide prizes for client
  const boxResponse = box.toObject();
  boxResponse.prizes = boxResponse.prizes.map(p => ({
    name: p.isSecret ? '???' : p.name,
    type: p.type,
    rarity: p.rarity,
    probability: p.probability,
    isSecret: p.isSecret,
  }));

  res.json({
    success: true,
    data: boxResponse,
  });
});

// @desc    Open box (Provably Fair)
// @route   POST /api/v1/boxes/:id/open
// @access  Private
const openBox = asyncHandler(async (req, res, next) => {
  const { clientSeed } = req.body;
  const box = await MysteryBox.findById(req.params.id);

  if (!box) {
    return next(new AppError('Box not found', 404));
  }

  if (box.status !== 'active') {
    return next(new AppError('This box is not available', 400));
  }

  // Check user balance
  const user = await User.findById(req.user.id);
  if (user.wallet.balance < box.price) {
    return next(new AppError('Insufficient balance', 400));
  }

  // Check daily limit
  if (box.dailyLimit.enabled) {
    const todayOpens = await MysteryBox.countDocuments({
      'stats.lastOpenedAt': { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
    });
    if (todayOpens >= box.dailyLimit.maxOpens) {
      return next(new AppError('Daily limit reached', 400));
    }
  }

  // Generate server seed and hash
  const serverSeed = generateServerSeed();
  const nonce = Date.now();
  const hash = generateHash(serverSeed, clientSeed || '', nonce);

  // Determine prize
  const prize = determinePrize(hash, box.prizes);

  // Deduct balance
  await User.findByIdAndUpdate(req.user.id, {
    $inc: { 'wallet.balance': -box.price },
  });

  // Update box stats
  box.stats.totalOpens += 1;
  box.stats.totalRevenue += box.price;
  box.stats.lastOpenedAt = new Date();
  await box.save();

  // Return result
  res.json({
    success: true,
    data: {
      prize: {
        name: prize.name,
        type: prize.type,
        value: prize.value,
        rarity: prize.rarity,
        image: prize.image,
      },
      serverSeed,
      hash,
      nonce,
    },
  });
});

// @desc    Verify box result
// @route   GET /api/v1/boxes/:id/verify/:hash
// @access  Public
const verifyResult = asyncHandler(async (req, res, next) => {
  const { hash, clientSeed, nonce } = req.query;

  const box = await MysteryBox.findById(req.params.id);
  if (!box) {
    return next(new AppError('Box not found', 404));
  }

  // Verify hash
  const expectedHash = generateHash(hash, clientSeed || '', nonce);
  const isValid = expectedHash === hash;

  const prize = determinePrize(hash, box.prizes);

  res.json({
    success: true,
    data: {
      isValid,
      prize: {
        name: prize.name,
        type: prize.type,
        value: prize.value,
        rarity: prize.rarity,
      },
    },
  });
});

module.exports = {
  getBoxes,
  getBox,
  openBox,
  verifyResult,
};
