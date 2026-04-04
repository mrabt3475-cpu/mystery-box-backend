const mongoose = require('mongoose');

const prizeSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  description: { type: String, trim: true, maxlength: 500 },
  image: { type: String, default: null },
  type: { type: String, enum: ['points', 'coupon', 'product', 'gift', 'badge', 'nothing'], required: true, index: true },
  value: { type: Number, default: 0, min: 0 },
  rarity: { type: String, enum: ['common', 'uncommon', 'rare', 'epic', 'legendary'], default: 'common', index: true },
  isActive: { type: Boolean, default: true, index: true },
  maxOccurrences: { type: Number, default: null, min: 1 },
  timesOpened: { type: Number, default: 0 },
  probability: { type: Number, default: 0, min: 0, max: 100 },
  metadata: { couponCode: String, productId: String, giftCardCode: String, badgeName: String }
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

prizeSchema.virtual('rarityColor').get(function() {
  const colors = { common: '#ffffff', uncommon: '#1eff00', rare: '#0070dd', epic: '#a335ee', legendary: '#ff8000' };
  return colors[this.rarity] || colors.common;
});

prizeSchema.index({ isActive: 1, rarity: 1 });
prizeSchema.index({ type: 1, isActive: 1 });

module.exports = mongoose.model('Prize', prizeSchema);