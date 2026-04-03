const GiftTransaction = require('../models/GiftTransaction.model');
const User = require('../models/user.model');
const PointsTransaction = require('../models/pointsTransaction.model');

class GiftService {
  async sendGift(senderId, receiverId, amount, message = '', options = {}) {
    if (amount < 1) {
      throw new Error('Minimum gift amount is 1 point');
    }

    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);

    if (!sender || !receiver) {
      throw new Error('User not found');
    }

    if (senderId.toString() === receiverId.toString()) {
      throw new Error('Cannot send gift to yourself');
    }

    if (sender.pointsBalance < amount) {
      throw new Error('Insufficient points');
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


    // Record transactions
    await PointsTransaction.create({
      user: senderId,
      amount: -amount,
      type: 'gift_sent',
      description: `إرسال هدية لـ ${receiver.username}`,
      balanceAfter: sender.pointsBalance
    });


    await PointsTransaction.create({
      user: receiverId,
      amount: amount,
      type: 'gift_received',
      description: `استلام هدية من ${sender.username}`,
      balanceAfter: receiver.pointsBalance
    });

    return gift;
  }

  async getGiftHistory(userId, type = 'all', page = 1, limit = 20) {
    const query = { $or: [{ sender: userId }, { receiver: userId }] };
    if (type === 'sent') query.sender = userId;
    else if (type === 'received') query.receiver = userId;

    const gifts = await GiftTransaction.find(query)
      .populate('sender', 'name username avatar')
      .populate('receiver', 'name username avatar')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await GiftTransaction.countDocuments(query);

    return { gifts, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async getGiftStats(userId) {
    const [sent, received] = await Promise.all([
      GiftTransaction.aggregate([
        { $match: { sender: userId } },
        { $group: { _id: null, totalAmount: { $sum: '$amount' }, count: { $sum: 1 } } }
      ]),
      GiftTransaction.aggregate([
        { $match: { receiver: userId } },
        { $group: { _id: null, totalAmount: { $sum: '$amount' }, count: { $sum: 1 } } }
      ])
    ]);

    return {
      sent: { total: sent[0]?.count || 0, amount: sent[0]?.totalAmount || 0 },
      received: { total: received[0]?.count || 0, amount: received[0]?.totalAmount || 0 }
    };
  }
}

module.exports = new GiftService();
