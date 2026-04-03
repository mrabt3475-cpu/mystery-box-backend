// Mystery Box Model
const mongoose = require('mongoose');
const config = require('../../config/constants');

const prizeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  type: {
    type: String,
    enum: Object.values(config.PRIZE_TYPES),
    required: true,
  },
  value: { type: Number, required: true },
  image: String,
  rarity: {
    type: String,
    enum: Object.values(config.BOX_RARITY),
    default: config.BOX_RARITY.COMMON,
  },
  probability: { type: Number, default: 10 },
  isSecret: { type: Boolean, default: false },
});

const boxSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: String,
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  originalPrice: Number,
  type: {
    type: String,
    enum: Object.values(config.BOX_TYPES),
    default: config.BOX_TYPES.STANDARD,
  },
  rarityDistribution: {
    common: { type: Number, default: 50 },
    rare: { type: Number, default: 30 },
    epic: { type: Number, default: 15 },
    legendary: { type: Number, default: 5 },
  },
  prizes: [prizeSchema],
  cooldown: {
    enabled: { type: Boolean, default: false },
    hours: { type: Number, default: 24 },
  },
  dailyLimit: {
    enabled: { type: Boolean, default: false },
    maxOpens: { type: Number, default: 10 },
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'limited', 'event'],
    default: 'active',
  },
  images: {
    closed: String,
    opening: String,
    open: String,
  },
  stats: {
    totalOpens: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 },
    lastOpenedAt: Date,
  },
  availableFrom: Date,
  availableUntil: Date,
  isFeatured: { type: Boolean, default: false },
  channel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Channel',
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Indexes
boxSchema.index({ status: 1 });
boxSchema.index({ type: 1 });
boxSchema.index({ 'stats.totalOpens': -1 });

// Virtual for final price
boxSchema.virtual('finalPrice').get(function() {
  if (this.originalPrice && this.originalPrice > this.price) {
    return this.price;
  }
  return this.price;
});

// Virtual for is available
boxSchema.virtual('isAvailable').get(function() {
  const now = new Date();
  if (this.availableFrom && now < this.availableFrom) return false;
  if (this.availableUntil && now > this.availableUntil) return false;
  return true;
});

module.exports = mongoose.model('MysteryBox', boxSchema);
