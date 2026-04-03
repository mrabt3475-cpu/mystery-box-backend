import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
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
  category: {
    type: String,
    required: true
  },
  images: [String],
  stock: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'out_of_stock'],
    default: 'active'
  },
  digital: {
    type: Boolean,
    default: false
  },
  downloadLink: String,
  stats: {
    views: { type: Number, default: 0 },
    purchases: { type: Number, default: 0 },
    revenue: { type: Number, default: 0 }
  },
  tags: [String]
}, {
  timestamps: true
});

productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1, status: 1 });

export default mongoose.model('Product', productSchema);
