const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Box = require('../models/Box.model');
const BoxOpening = require('../models/BoxOpening.model');
const User = require('../models/user.model');
const PointsTransaction = require('../models/pointsTransaction.model');
const RewardsService = require('../services/rewards.service');
const { auth } = require('../middleware/auth.middleware');
const { catchAsync } = require('../middleware/errorHandler.middleware');
const { validators } = require('../utils/validation');
const { NotFoundError, ValidationError, InsufficientFundsError } = require('../utils/AppError');
const { formatSuccess, formatPaginated } = require('../utils/responseFormatter');

// Get all boxes
router.get('/', catchAsync(async (req, res) => {
  const boxes = await Box.find({ isActive: true })
    .sort({ order: 1 })
    .select('-prizes');
  
  res.json(formatSuccess(boxes));
}));

// Get box by ID
router.get('/:id', validators.isObjectId('id'), catchAsync(async (req, res) => {
  const box = await Box.findById(req.params.id).populate('prizes.prizeId');
  
  if (!box) {
    throw new NotFoundError('الصندوق');
  }
  
  res.json(formatSuccess(box));
}));

// Open box - WITH TRANSACTION
router.post('/:id/open', auth, validators.isObjectId('id'), catchAsync(async (req, res) => {
  const boxId = req.params.id;
  const userId = req.user.id;
  const clientSeed = req.body.clientSeed || RewardsService.generateSeed();

  const session = await mongoose.startSession();
  
  try {
    let result;
    
    await session.withTransaction(async () => {
      const box = await Box.findById(boxId).session(session);
      
      if (!box || !box.isActive) {
        throw new NotFoundError('الصندوق');
      }

      const user = await User.findById(userId).session(session);
      
      if (!user) {
        throw new NotFoundError('المستخدم');
      }

      if (user.pointsBalance < box.cost) {
        throw new InsufficientFundsError();
      }

      user.pointsBalance -= box.cost;
      user.stats.boxesOpened = (user.stats.boxesOpened || 0) + 1;
      user.stats.totalSpent = (user.stats.totalSpent || 0) + box.cost;
      await user.save({ session });

      const prize = await RewardsService.selectPrize(box);

      const opening = await BoxOpening.create([{
        user: userId,
        box: boxId,
        prize: prize._id,
        cost: box.cost,
        seed: RewardsService.generateSeed(),
        serverSeed: RewardsService.generateSeed(),
        clientSeed,
        nonce: 1
      }], { session });

      prize.timesOpened = (prize.timesOpened || 0) + 1;
      await prize.save({ session });

      await PointsTransaction.create([{
        user: userId,
        amount: -box.cost,
        type: 'box_open',
        description: `فتح صندوق ${box.name}`,
        balanceAfter: user.pointsBalance,
        reference: opening[0]._id,
        referenceType: 'BoxOpening'
      }], { session });

      result = {
        opening: opening[0],
        prize,
        remainingBalance: user.pointsBalance
      };
    });
    
    session.endSession();
    
    res.json(formatSuccess(result, '🎉 تهانينا!'));
    
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
}));

// Admin: Create box
router.post('/', auth, catchAsync(async (req, res) => {
  if (req.user.role !== 'admin') {
    throw new ValidationError('غير مصرح لك');
  }
  
  const box = await Box.create(req.body);
  res.status(201).json(formatSuccess(box, '✅ تم إنشاء الصندوق'));
}));

// Admin: Update box
router.put('/:id', auth, validators.isObjectId('id'), catchAsync(async (req, res) => {
  if (req.user.role !== 'admin') {
    throw new ValidationError('غير مصرح لك');
  }
  
  const box = await Box.findByIdAndUpdate(req.params.id, req.body, { new: true });
  
  if (!box) {
    throw new NotFoundError('الصندوق');
  }
  
  res.json(formatSuccess(box, '✅ تم تحديث الصندوق'));
}));

// Admin: Delete box
router.delete('/:id', auth, validators.isObjectId('id'), catchAsync(async (req, res) => {
  if (req.user.role !== 'admin') {
    throw new ValidationError('غير مصرح لك');
  }
  
  const box = await Box.findByIdAndDelete(req.params.id);
  
  if (!box) {
    throw new NotFoundError('الصندوق');
  }
  
  res.json(formatSuccess(null, '✅ تم حذف الصندوق'));
}));

module.exports = router;
