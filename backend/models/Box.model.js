const mongoose = require('mongoose');

const boxSchema = new mongoose.Schema({
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
  cost: {
    type: Number,
    required: true,
    min: 1
  },
  category: {
    type: String,
    enum: ['standard', 'premium', 'vip', 'special'],
    default: 'standard'
  },
  color: {
    type: String,
    default: '#6366f1'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  },
  prizes: [{
    prizeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Prize',
      required: true
    },
    weight: {
      type: Number,
      required: true,
      min: 1
    }
  }],
  minPrizeCount: {
    type: Number,
    default: 1
  },
  maxPrizeCount: {
    type: Number,
    default: 1
  },
  isSpecial: {
    type: Boolean,
    default: false
  },
  featured: {
    type: Boolean,
    default: false
  },
  openAnimation: {
    type: String,
    enum: ['default', 'shake', 'spin', 'explode'],
    default: 'default'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Box', boxSchema);
