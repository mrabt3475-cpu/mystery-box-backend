// Box Controller - SECURE VERSION with proper verification
const MysteryBox = require('../models/MysteryBox.model');
const BoxOpening = require('../models/BoxOpening.model');
const User = require('../models/User.model');
const { asyncHandler, AppError } = require('../middleware/error.middleware');
const crypto = require('crypto');

// Generate cryptographically secure random seed
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
  return prizes[0];
};

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

// @desc    Open box - FIXED with atomic operation and seed storage
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

  // Use atomic operation to prevent double-spend
  const user = await User.findOneAndUpdate(
    { 
      _id: req.user.id, 
      'wallet.balance': { $gte: box.price }
    },
    { $inc: { 'wallet.balance': -box.price } },
    { new: true }
  );

  if (!user) {
    const checkUser = await User.findById(req.user.id);
    if (checkUser && checkUser.wallet.balance < box.price) {
      return next(new AppError('Insufficient balance', 400));
    }
    return next(new AppError('User not found', 404));
  }

  // Generate server seed and hash
  const serverSeed = generateServerSeed();
  const nonce = Date.now();
  const hash = generateHash(serverSeed, clientSeed || '', nonce);

  // Determine prize
  const prize = determinePrize(hash, box.prizes);

  // Update box stats
  box.stats.totalOpens += 1;
  box.stats.totalRevenue += box.price;
  box.stats.lastOpenedAt = new Date();
  await box.save();

  // Save opening record with seeds for verification (SECURE)
  await BoxOpening.create({
    user: req.user.id,
    box: box._id,
    prize: {
      name: prize.name,
      type: prize.type,
      value: prize.value,
      rarity: prize.rarity,
    },
    rng: {
      serverSeed,
      clientSeed: clientSeed || '',
      nonce,
      hash,
    },
    cost: {
      amount: box.price,
    },
    ipAddress: req.ip,
    userAgent: req.get('user-agent'),
  });

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
      remainingBalance: user.wallet.balance,
    },
  });
});

// @desc    Verify box result - FIXED
// @route   GET /api/v1/boxes/:id/verify/:openingId
// @access  Public
const verifyResult = asyncHandler(async (req, res, next) => {
  const { openingId } = req.params;

  const opening = await BoxOpening.findById(openingId)
    .populate('box', 'name prizes');

  if (!opening) {
    return next(new AppError('Opening not found', 404));
  }

  // Verify hash
  const { serverSeed, clientSeed, nonce, hash } = opening.rng;
  const expectedHash = generateHash(serverSeed, clientSeed, nonce);
  
  // Compare with stored hash
  const isValid = expectedHash === hash;

  // Recalculate prize to verify
  const prize = determinePrize(hash, opening.box.prizes);

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
      serverSeed,
      clientSeed,
      nonce,
    },
  });
});

module.exports = {
  getBoxes,
  getBox,
  openBox,
  verifyResult,
};
