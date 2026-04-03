// Box Controller - SECURE VERSION with Race Condition Fix
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
  return prizes[0];
};

// @desc    Open box - FIXED Race Condition (Double-Spend)
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

  // SECURITY FIX: Use atomic operation to prevent double-spend
  // This ensures balance check and deduction happen atomically
  const user = await User.findOneAndUpdate(
    { 
      _id: req.user.id, 
      'wallet.balance': { $gte: box.price } // Atomic check
    },
    { 
      $inc: { 'wallet.balance': -box.price } // Atomic deduction
    },
    { new: true }
  );

  // If user is null, either user doesn't exist or insufficient balance
  if (!user) {
    // Check if user exists but has insufficient balance
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
      remainingBalance: user.wallet.balance,
    },
  });
});

module.exports = {
  getBoxes,
  getBox,
  openBox,
  verifyResult,
};
