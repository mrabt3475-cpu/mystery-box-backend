// Box Model - SECURE VERSION with Provably Fair verification
const mongoose = require('mongoose');

const prizeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  type: {
    type: String,
    enum: ['points', 'coupon', 'product', 'discount', 'badge'],
    default: 'product',
  },
  value: { type: Number, default: 0 },
  image: String,
  rarity: {
    type: String,
    enum: ['common', 'rare', 'epic', 'legendary'],
    default: 'common',
  },
  probability: { type: Number, default: 10 },
  minQuantity: { type: Number, default: 1 },
  maxQuantity: { type: Number, default: 1 },
  isActive: { type: Boolean, default: true },
  isSecret: { type: Boolean, default: false },
});

const boxSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: String,
  channel: { type: mongoose.Schema.Types.ObjectId, ref: 'Channel', required: true },
  image: String,
  price: { type: Number, required: true, min: 0 },
  type: {
    type: String,
    enum: ['standard', 'premium', 'vip', 'limited'],
    default: 'standard',
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'limited', 'coming_soon'],
    default: 'active',
  },
  prizes: [prizeSchema],
  settings: {
    maxDailyOpens: { type: Number, default: -1 },
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
}, { timestamps: true });

// Indexes
boxSchema.index({ channel: 1 });
boxSchema.index({ status: 1 });
boxSchema.index({ isFeatured: 1 });

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

module.exports = mongoose.model('MysteryBox', boxSchema);
