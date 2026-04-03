const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
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
  images: [{
    type: String
  }],
  price: {
    type: Number,
    required: true,
    min: 0
  },
  pointsReward: {
    type: Number,
    default: 0
  },
  category: {
    type: String,
    default: 'general'
  },
  stock: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  },
  features: [{
    type: String
  }],
  specifications: {
    type: Map,
    of: String
  }
}, {
  timestamps: true
});

productSchema.index({ isActive: 1, order: 1 });
productSchema.index({ category: 1 });
productSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);
