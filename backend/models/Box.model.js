const mongoose = require('mongoose');

const boxSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  description: { type: String, trim: true, maxlength: 500 },
  image: { type: String, default: null },
  cost: { type: Number, required: true, min: 1 },
  category: { type: String, default: 'general', index: true },
  isActive: { type: Boolean, default: true, index: true },
  isFeatured: { type: Boolean, default: false },
  order: { type: Number, default: 0, index: true },
  minLevel: { type: Number, default: 1 },
  prizes: [{
    prizeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Prize', required: true },
    weight: { type: Number, required: true, min: 0 },
    minAmount: { type: Number, default: 1 },
    maxAmount: { type: Number, default: 1 }
  }],
  settings: {
    cooldown: { type: Number, default: 0 },
    maxPerDay: { type: Number, default: 0 },
    maxPerUser: { type: Number, default: 0 }
  },
  stats: { timesOpened: { type: Number, default: 0 }, totalValue: { type: Number, default: 0 } }
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

boxSchema.virtual('totalWeight').get(function() {
  if (!this.prizes) return 0;
  return this.prizes.reduce((sum, p) => sum + p.weight, 0);
});

boxSchema.index({ isActive: 1, order: 1 });
boxSchema.index({ category: 1, isActive: 1 });

module.exports = mongoose.model('Box', boxSchema);