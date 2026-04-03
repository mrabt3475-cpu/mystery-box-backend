const mongoose = require('mongoose');

const prizeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  image: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    enum: ['points', 'coupon', 'product', 'gift', 'badge', 'nothing'],
    required: true
  },
  value: {
    type: Number,
    default: 0
  },
  rarity: {
    type: String,
    enum: ['common', 'uncommon', 'rare', 'epic', 'legendary'],
    default: 'common'
  },
  color: {
    type: String,
    default: '#6366f1'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  timesOpened: {
    type: Number,
    default: 0
  },
  maxOccurrences: {
    type: Number,
    default: null
  },
  category: {
    type: String,
    default: 'general'
  },
  expiresAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Prize', prizeSchema);
