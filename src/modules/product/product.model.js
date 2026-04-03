import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: String,
  price: {
    type: Number,
    required: true,
    min: 0
  },
  originalPrice: Number,
  category: String,
  channel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Channel'
  },
  images: [{
    url: String,
    isPrimary: { type: Boolean, default: false }
  }],
  type: {
    type: String,
    enum: ['digital', 'subscription', 'gift_card', 'crypto'],
    default: 'digital'
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'out_of_stock'],
    default: 'active'
  },
  stock: {
    type: Number,
    default: -1 // -1 means unlimited
  },
  sku: String,
  tags: [String],
  features: [String],
  stats: {
    views: { type: Number, default: 0 },
    purchases: { type: Number, default: 0 },
    revenue: { type: Number, default: 0 }
  },
  isFeatured: { type: Boolean, default: false },
  isFree: { type: Boolean, default: false },
  pointsPrice: { type: Number, default: 0 }
}, {
  timestamps: true
});

productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1, status: 1 });

export default mongoose.model('Product', productSchema);
