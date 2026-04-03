import mongoose from 'mongoose';

const prizeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  type: {
    type: String,
    enum: ['points', 'coupon', 'product', 'discount', 'badge'],
    required: true
  },
  value: { type: Number, required: true },
  image: String,
  rarity: {
    type: String,
    enum: ['common', 'rare', 'epic', 'legendary'],
    default: 'common'
  },
  probability: { type: Number, default: 10 }
});

const boxSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  price: {
    type: Number,
    required: true,
    min: 0
  },
  originalPrice: Number,
  type: {
    type: String,
    enum: ['standard', 'premium', 'vip', 'limited'],
    default: 'standard'
  },
  rarityDistribution: {
    common: { type: Number, default: 50 },
    rare: { type: Number, default: 30 },
    epic: { type: Number, default: 15 },
    legendary: { type: Number, default: 5 }
  },
  prizes: [prizeSchema],
  cooldown: {
    enabled: { type: Boolean, default: false },
    hours: { type: Number, default: 24 }
  },
  dailyLimit: {
    enabled: { type: Boolean, default: false },
    maxOpens: { type: Number, default: 10 }
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'limited', 'event'],
    default: 'active'
  },
  images: {
    closed: String,
    opening: String,
    open: String
  },
  stats: {
    totalOpens: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 }
  },
  availableFrom: Date,
  availableUntil: Date,
  isFeatured: { type: Boolean, default: false }
}, {
  timestamps: true
});

export default mongoose.model('MysteryBox', boxSchema);
