const express = require('express');
const router = express.Router();
const Box = require('../models/Box.model');
const BoxOpening = require('../models/BoxOpening.model');
const User = require('../models/user.model');
const RewardsService = require('../services/rewards.service');
const { auth, requireRole } = require('../middleware/auth.middleware');
const { boxLimiter } = require('../middleware/rateLimiter.middleware');
const { catchAsync } = require('../utils/errorHandler');
const { validation, ObjectId, isNumber } = require('../utils/validation');
const { NotFoundError, InsufficientFundsError, ValidationError } = require('../utils/errors');
const { runTransaction } = require('../utils/database');
const mongoose = require('mongoose');

// Get all boxes
router.get('/', catchAsync(async (req, res) => {
  const boxes = await Box.find({ isActive: true })
    .sort({ order: 1 })
    .select('-prizes');
  
  res.json({ success: true, data: boxes });
}));

// Get box by ID
router.get('/:id', catchAsync(async (req, res) => {
  const box = await Box.findById(req.params.id).populate('prizes.prizeId');
  
  if (!box) {
    throw new NotFoundError('الصندوق');
  }
  
  res.json({ success: true, data: box });
}));

// Open box - with transaction for atomic updates
router.post('/:id/open', auth, boxLimiter, catchAsync(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const clientSeed = req.body.clientSeed || RewardsService.generateSeed();

  // Validate box ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ValidationError('معرف الصندوق غير صالح');
  }

  // Use transaction for atomic updates
  const result = await runTransaction(async (session) => {
    // Get box with lock
    const box = await Box.findById(id).session(session);
    
    if (!box || !box.isActive) {
      throw new NotFoundError('الصندوق');
    }

    // Get user with lock
    const user = await User.findById(userId).session(session);
    
    if (!user) {
      throw new NotFoundError('المستخدم');
    }

    // Check balance BEFORE deducting
    if (user.pointsBalance < box.cost) {
      throw new InsufficientFundsError();
    }

    // Deduct points atomically
    user.pointsBalance -= box.cost;
    user.stats.boxesOpened += 1;
    user.stats.totalSpent += box.cost;
    await user.save({ session });

    // Select prize
    const prize = await RewardsService.selectPrize(box);

    // Create opening record
    const opening = await BoxOpening.create([{
      user: userId,
      box: box._id,
      prize: prize._id,
      cost: box.cost,
      seed: RewardsService.generateSeed(),
      serverSeed: RewardsService.generateSeed(),
      clientSeed,
      nonce: 1
    }], { session });

    // Update prize times opened
    prize.timesOpened = (prize.timesOpened || 0) + 1;
    await prize.save({ session });

    return {
      opening: opening[0],
      prize,
      remainingBalance: user.pointsBalance
    };
  });

  res.json({
    success: true,
    data: result
  });
}));

// Admin: Create box
router.post('/', auth, requireRole('admin'), catchAsync(async (req, res) => {
  const box = await Box.create(req.body);
  res.status(201).json({ success: true, data: box });
}));

// Admin: Update box
router.put('/:id', auth, requireRole('admin'), catchAsync(async (req, res) => {
  const box = await Box.findByIdAndUpdate(req.params.id, req.body, { new: true });
  
  if (!box) {
    throw new NotFoundError('الصندوق');
  }
  
  res.json({ success: true, data: box });
}));

// Admin: Delete box
router.delete('/:id', auth, requireRole('admin'), catchAsync(async (req, res) => {
  const box = await Box.findByIdAndDelete(req.params.id);
  
  if (!box) {
    throw new NotFoundError('الصندوق');
  }
  
  res.json({ success: true, message: 'تم حذف الصندوق' });
}));

module.exports = router;
