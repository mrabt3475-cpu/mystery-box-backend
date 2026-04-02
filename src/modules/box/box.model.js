import mongoose from 'mongoose';

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
  type: {
    type: String,
    enum: ['standard', 'premium', 'vip', 'limited'],
    default: 'standard'
  },
  prizes: [{
    name: String,
    type: String,
    value: Number,
    rarity: {
      type: String,
      enum: ['common', 'rare', 'epic', 'legendary'],
      default: 'common'
    },
    probability: {
      type: Number,
      default: 10
    }
  }],
  status: {
    type: String,
    enum: ['active', 'inactive', 'limited'],
    default: 'active'
  },
  stats: {
    totalOpens: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

export const Box = mongoose.model('Box', boxSchema);
