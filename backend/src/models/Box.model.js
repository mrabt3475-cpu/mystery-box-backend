// Box Model - Mystery Boxes
const mongoose = require('mongoose');
const config = require('../../config/constants');

const prizeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  type: {
    type: String,
    enum: Object.values(config.PRIZE_TYPES),
    default: config.PRIZE_TYPES.PRODUCT,
  },
  value: { type: Number, default: 0 },
  image: String,
  rarity: {
    type: String,
    enum: Object.values(config.BOX_RARITY),
    default: config.BOX_RARITY.COMMON,
  },
  probability: { type: Number, default: 10 },
  minQuantity: { type: Number, default: 1 },
  maxQuantity: { type: Number, default: 1 },
  isActive: { type: Boolean, default: true },
});

const boxSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a box name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters'],
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot be more than 500 characters'],
  },
  channel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Channel',
    required: true,
  },
  image: {
    type: String,
    default: '',
  },
  price: {
    type: Number,
    required: [true, 'Please provide a price'],
    min: [0, 'Price cannot be negative'],
  },
  pointsPrice: {
    type: Number,
    default: 0,
  },
  type: {
    type: String,
    enum: Object.values(config.BOX_TYPES),
    default: config.BOX_TYPES.STANDARD,
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'limited', 'coming_soon'],
    default: 'active',
  },
  prizes: [prizeSchema],
  settings: {
    maxDailyOpens: { type: Number, default: -1 },
    minSubscription: { type: String, default: null },
    requiresPoints: { type: Boolean, default: false },
    cooldown: { type: Number, default: 0 },
  },
  stats: {
    totalOpens: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 },
    todayOpens: { type: Number, default: 0 },
    lastResetAt: Date,
  },
  startDate: Date,
  endDate: Date,
  isFeatured: { type: Boolean, default: false },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Indexes
boxSchema.index({ channel: 1 });
boxSchema.index({ status: 1 });
boxSchema.index({ isFeatured: 1 });
boxSchema.index({ 'stats.totalOpens': -1 });

// Method to select a random prize based on probability
boxSchema.methods.selectPrize = function() {
  const activePrizes = this.prizes.filter(p => p.isActive);
  const totalProbability = activePrizes.reduce((sum, p) => sum + p.probability, 0);
  
  let random = Math.random() * totalProbability;
  
  for (const prize of activePrizes) {
    random -= prize.probability;
    if (random <= 0) {
      const quantity = Math.floor(
        Math.random() * (prize.maxQuantity - prize.minQuantity + 1)
      ) + prize.minQuantity;
      return { ...prize.toObject(), quantity };
    }
  }
  
  return { ...activePrizes[0].toObject(), quantity: 1 };
};

module.exports = mongoose.model('Box', boxSchema);
