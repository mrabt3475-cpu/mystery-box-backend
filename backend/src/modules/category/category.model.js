import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  description: String,
  image: String,
  icon: String,
  
  // نوع الفئة - يحدد نوع المنتجات فيها
  type: {
    type: String,
    enum: ['product', 'bot', 'group', 'channel', 'mixed'],
    default: 'product'
  },
  
  // الفئة الأم
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null
  },
  children: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }],
  
  // الإعدادات
  displayOrder: { type: Number, default: 0 },
  isFeatured: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  showInMenu: { type: Boolean, default: true },
  showInHome: { type: Boolean, default: false },
  
  // SEO
  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String]
  },
  
  // الإحصائيات
  productCount: { type: Number, default: 0 },
  
  // اللون والستايل
  color: {
    type: String,
    default: '#6366f1'
  },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Index
categorySchema.index({ slug: 1 });
categorySchema.index({ parent: 1 });
categorySchema.index({ displayOrder: 1 });

// Pre-save
categorySchema.pre('save', function(next) {
  if (!this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  this.updatedAt = new Date();
  next();
});

export default mongoose.model('Category', categorySchema);
