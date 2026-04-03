const mongoose = require('mongoose');

const giftTransactionSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 1
  },
  message: {
    type: String,
    maxLength: 500,
    default: ''
  },
  type: {
    type: String,
    enum: ['gift', 'transfer', 'bonus'],
    default: 'gift'
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'cancelled', 'failed'],
    default: 'completed'
  },
  giftType: {
    type: String,
    enum: ['birthday', 'reward', 'gift', 'custom'],
    default: 'custom'
  },
  isAnonymous: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
giftTransactionSchema.index({ sender: 1, createdAt: -1 });
giftTransactionSchema.index({ receiver: 1, createdAt: -1 });

module.exports = mongoose.model('GiftTransaction', giftTransactionSchema);
