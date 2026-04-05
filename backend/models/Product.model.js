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
  // Pricing fields
  costPrice: {
    type: Number,
    default: 0,
    min: 0
  },
  originalPrice: {
    type: Number,
    default: null,
    min: 0
  },
  // Points system
  pointsReward: {
    type: Number,
    default: 0
  },
  // Category & Classification
  category: {
    type: String,
    default: 'general'
  },
  brand: {
    type: String,
    default: ''
  },
  sku: {
    type: String,
    default: ''
  },
  barcode: {
    type: String,
    default: ''
  },
  // Search optimization
  tags: [{
    type: String
  }],
  // Stock management
  stock: {
    type: Number,
    default: 0
  },
  lowStockThreshold: {
    type: Number,
    default: 5
  },
  // Status
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  },
  // Additional
  features: [{
    type: String
  }],
  specifications: {
    type: Map,
    of: String
  },
  // Weight for sorting
  weight: {
    type: Number,
    default: 1
  }
}, {
  timestamps: true
});

// Indexes for search
productSchema.index({ isActive: 1, order: 1 });
productSchema.index({ category: 1 });
productSchema.index({ name: 'text', description: 'text', tags: 'text', brand: 'text' });
productSchema.index({ price: 1 });
productSchema.index({ stock: 1 });
productSchema.index({ sku: 1 });
productSchema.index({ barcode: 1 });
productSchema.index({ tags: 1 });

// Virtual for profit margin
productSchema.virtual('profitMargin').get(function() {
  if (!this.price || !this.costPrice || this.price === 0) return 0;
  return Math.round(((this.price - this.costPrice) / this.price) * 100 * 100) / 100;
});

// Virtual for discount percent
productSchema.virtual('discountPercent').get(function() {
  if (!this.originalPrice || !this.price || this.originalPrice <= this.price) return 0;
  return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
});

// Virtual for in stock
productSchema.virtual('inStock').get(function() {
  return this.stock > 0;
});

// Ensure virtuals are included in JSON
productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Product', productSchema);