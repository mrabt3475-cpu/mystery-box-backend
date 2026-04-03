const mongoose = require('mongoose');

const pointsTransactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: [
      'purchase',
      'box_open',
      'referral_bonus',
      'gift_sent',
      'gift_received',
      'admin_bonus',
      'admin_deduction',
      'refund',
      'deposit',
      'withdrawal',
      'birthday_bonus',
      'daily_bonus',
      'streak_bonus'
    ],
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  reference: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'referenceType',
    default: null
  },
  referenceType: {
    type: String,
    enum: ['Order', 'BoxOpening', 'GiftTransaction', 'Service'],
    default: null
  },
  balanceAfter: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

// Index for queries
pointsTransactionSchema.index({ user: 1, createdAt: -1 });
pointsTransactionSchema.index({ user: 1, type: 1 });

module.exports = mongoose.model('PointsTransaction', pointsTransactionSchema);
