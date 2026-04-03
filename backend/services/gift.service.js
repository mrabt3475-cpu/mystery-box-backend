const GiftTransaction = require('../models/giftTransaction.model');
const User = require('../models/user.model');
const PointsTransaction = require('../models/pointsTransaction.model');

class GiftService {
  // Send gift points to another user
  async sendGift(senderId, receiverId, amount, message = '', options = {}) {
    // Validate amount
    if (amount < 1) {
      throw new Error('Minimum gift amount is 1 point');
    }

    // Check sender has enough points
    const sender = await User.findById(senderId);
    if (!sender) {
      throw new Error('Sender not found');
    }

    if (sender.pointsBalance < amount) {
      throw new Error('Insufficient points');
    }

    // Check receiver exists
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      throw new Error('Receiver not found');
    }

    if (senderId.toString() === receiverId.toString()) {
      throw new Error('Cannot send gift to yourself');
    }

    // Deduct from sender
    sender.pointsBalance -= amount;
    await sender.save();

    // Add to receiver
    receiver.pointsBalance += amount;
    await receiver.save();

    // Create gift transaction
    const gift = await GiftTransaction.create({
      sender: senderId,
      receiver: receiverId,
      amount,
      message,
      type: 'gift',
      giftType: options.giftType || 'custom',
      isAnonymous: options.isAnonymous || false
    });

    // Record sender's transaction
    await PointsTransaction.create({
      user: senderId,
      amount: -amount,
      type: 'gift_sent',
      description: `إرسال هدية لـ ${receiver.username}`,
      reference: gift._id
    });

    // Record receiver's transaction
    await PointsTransaction.create({
      user: receiverId,
      amount: amount,
      type: 'gift_received',
      description: `استلام هدية من ${sender.username}`,
      reference: gift._id
    });

    return gift;
  }

  // Get gift history for a user
  async getGiftHistory(userId, type = 'all', page = 1, limit = 20) {
    const query = {
      $or: [{ sender: userId }, { receiver: userId }]
    };

    if (type === 'sent') {
      query.sender = userId;
    } else if (type === 'received') {
      query.receiver = userId;
    }

    const gifts = await GiftTransaction.find(query)
      .populate('sender', 'name username avatar')
      .populate('receiver', 'name username avatar')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await GiftTransaction.countDocuments(query);

    return {
      gifts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  // Get gift statistics
  async getGiftStats(userId) {
    const [sent, received] = await Promise.all([
      GiftTransaction.aggregate([
        { $match: { sender: userId } },
        {
          $group: {
            _id: null,
            totalAmount: { $sum: '$amount' },
            count: { $sum: 1 }
          }
        }
      ]),
      GiftTransaction.aggregate([
        { $match: { receiver: userId } },
        {
          $group: {
            _id: null,
            totalAmount: { $sum: '$amount' },
            count: { $sum: 1 }
          }
        }
      ])
    ]);

    return {
      sent: {
        total: sent[0]?.count || 0,
        amount: sent[0]?.totalAmount || 0
      },
      received: {
        total: received[0]?.count || 0,
        amount: received[0]?.totalAmount || 0
      }
    };
  }

  // Send birthday bonus
  async sendBirthdayBonus(userId, amount = 100) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    user.pointsBalance += amount;
    await user.save();

    const gift = await GiftTransaction.create({
      sender: process.env.SYSTEM_USER_ID || 'system',
      receiver: userId,
      amount,
      message: '🎂 Happy Birthday! مكافأة عيد ميلادك!',
      type: 'bonus',
      giftType: 'birthday',
      status: 'completed'
    });

    await PointsTransaction.create({
      user: userId,
      amount,
      type: 'birthday_bonus',
      description: 'مكافأة عيد الميلاد',
      reference: gift._id
    });

    return gift;
  }
}

module.exports = new GiftService();
