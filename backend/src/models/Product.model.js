// Product Model
const mongoose = require('mongoose');
const config = require('../../config/constants');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a product name'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters'],
  },
  description: {
    type: String,
    maxlength: [1000, 'Description cannot be more than 1000 characters'],
  },
  price: {
    type: Number,
    required: [true, 'Please provide a price'],
    min: [0, 'Price cannot be negative'],
  },
  originalPrice: {
    type: Number,
    min: [0, 'Original price cannot be negative'],
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  },
  channel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Channel',
    required: true,
  },
  images: [{
    url: String,
    isPrimary: { type: Boolean, default: false },
  }],
  type: {
    type: String,
    enum: ['digital', 'subscription', 'gift_card', 'crypto'],
    default: 'digital',
  },
  status: {
    type: String,
    enum: Object.values(config.PRODUCT_STATUS),
    default: config.PRODUCT_STATUS.ACTIVE,
  },
  stock: {
    type: Number,
    default: -1, // -1 means unlimited
  },
  sku: {
    type: String,
    unique: true,
  },
  tags: [String],
  features: [String],
  requirements: {
    minAge: { type: Number, default: 0 },
    subscriptionRequired: { type: String, default: null },
  },
  stats: {
    views: { type: Number, default: 0 },
    purchases: { type: Number, default: 0 },
    revenue: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    reviewsCount: { type: Number, default: 0 },
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  isFree: {
    type: Boolean,
    default: false,
  },
  pointsPrice: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Indexes
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ channel: 1 });
productSchema.index({ category: 1 });
productSchema.index({ status: 1 });
productSchema.index({ 'stats.purchases': -1 });
productSchema.index({ isFeatured: 1 });

// Virtual for discount percentage
productSchema.virtual('discountPercentage').get(function() {
  if (this.originalPrice && this.originalPrice > this.price) {
    return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
  }
  return 0;
});

// Virtual for final price
productSchema.virtual('finalPrice').get(function() {
  return this.price;
});

// Static method to increment views
productSchema.statics.incrementViews = async function(productId) {
  return this.findByIdAndUpdate(productId, {
    $inc: { 'stats.views': 1 },
  });
};

// Static method to increment purchases
productSchema.statics.incrementPurchases = async function(productId, amount) {
  return this.findByIdAndUpdate(productId, {
    $inc: {
      'stats.purchases': 1,
      'stats.revenue': amount,
    },
  });
};

module.exports = mongoose.model('Product', productSchema);
