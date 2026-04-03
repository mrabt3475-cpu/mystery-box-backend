const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const GiftTransaction = require('../models/GiftTransaction.model');
const User = require('../models/user.model');
const PointsTransaction = require('../models/pointsTransaction.model');
const GiftService = require('../services/gift.service');
const { auth } = require('../middleware/auth.middleware');
const { catchAsync } = require('../middleware/errorHandler.middleware');
const { validators } = require('../utils/validation');
const { NotFoundError, ValidationError, ConflictError } = require('../utils/AppError');
const { formatSuccess } = require('../utils/responseFormatter');

// Send gift points - WITH TRANSACTION
router.post('/send', auth, validators.gift, catchAsync(async (req, res) => {
  const { receiverId, amount, message, isAnonymous } = req.body;
  const senderId = req.user.id;

  // Validate receiver exists
  const receiver = await User.findById(receiverId);
  if (!receiver) {
    throw new NotFoundError('المستلم');
  }

  // Prevent self-gift
  if (senderId === receiverId) {
    throw new ConflictError('لا يمكنك إرسال هدية لنفسك');
  }

  // Start MongoDB Transaction
  const session = await mongoose.startSession();
  
  try {
    let gift;
    
    await session.withTransaction(async () => {
      // 1. Get sender with lock
      const sender = await User.findById(senderId).session(session);
      
      if (!sender) {
        throw new NotFoundError('المرسل');
      }

      // 2. Check balance
      if (sender.pointsBalance < amount) {
        throw new ValidationError('رصيدك غير كافٍ');
      }

      // 3. Deduct from sender
      sender.pointsBalance -= amount;
      await sender.save({ session });


      // 4. Add to receiver
      receiver.pointsBalance += amount;
      await receiver.save({ session });

      // 5. Create gift transaction
      gift = await GiftTransaction.create([{
        sender: senderId,
        receiver: receiverId,
        amount,
        message,
        type: 'gift',
        giftType: 'custom',
        isAnonymous: isAnonymous || false,
        status: 'completed'
      }], { session });

      // 6. Record sender's transaction
      await PointsTransaction.create([{
        user: senderId,
        amount: -amount,
        type: 'gift_sent',
        description: `إرسال هدية لـ ${receiver.username}`,
        balanceAfter: sender.pointsBalance,
        reference: gift[0]._id,
        referenceType: 'GiftTransaction'
      }], { session });


      // 7. Record receiver's transaction
      await PointsTransaction.create([{
        user: receiverId,
        amount,
        type: 'gift_received',
        description: `استلام هدية من ${sender.username}`,
        balanceAfter: receiver.pointsBalance,
        reference: gift[0]._id,
        referenceType: 'GiftTransaction'
      }], { session });
    });
    
    session.endSession();
    
    res.json(formatSuccess(gift[0], '✅ تم إرسال الهدية بنجاح'));
    
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
}));

// Get gift history
router.get('/history', auth, catchAsync(async (req, res) => {
  const { type = 'all', page = 1, limit = 20 } = req.query;
  
  const result = await GiftService.getGiftHistory(
    req.user.id, 
    type, 
    parseInt(page), 
    parseInt(limit)
  );
  
  res.json(formatSuccess(result.gifts, null, result.pagination));
}));

// Get gift statistics
router.get('/stats', auth, catchAsync(async (req, res) => {
  const stats = await GiftService.getGiftStats(req.user.id);
  res.json(formatSuccess(stats));
}));

module.exports = router;
