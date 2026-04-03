import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  // المعلومات الأساسية
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
  sku: {
    type: String,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  shortDescription: {
    type: String,
    maxlength: 200
  },
  
  // نوع المنتج
  productType: {
    type: String,
    enum: ['physical', 'digital', 'bot', 'group', 'channel', 'subscription'],
    required: true
  },
  
  // الفئة
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  subcategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  },
  tags: [String],
  
  // السعر
  price: {
    type: Number,
    required: true,
    min: 0
  },
  comparePrice: Number,
  currency: {
    type: String,
    default: 'USD'
  },
  costPerItem: Number,
  
  // نظام الاشتراك
  subscription: {
    isSubscription: { type: Boolean, default: false },
    billingCycle: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'yearly', 'one-time'],
      default: 'one-time'
    },
    subscriptionPrice: Number,
    trialDays: { type: Number, default: 0 },
    cancelAnytime: { type: Boolean, default: true }
  },
  
  // المخزون
  stock: {
    type: Number,
    default: 0,
    min: 0
  },
  sku: String,
  trackInventory: { type: Boolean, default: true },
  lowStockThreshold: { type: Number, default: 10 },
  allowOutOfStock: { type: Boolean, default: false },
  
  // المنتج الرقمي
  digitalProduct: {
    isDigital: { type: Boolean, default: false },
    fileUrl: String,
    downloadLimit: { type: Number, default: 5 },
    downloadExpiry: { type: Number, default: 7 },
    fileSize: String,
    fileFormat: String
  },
  
  // البوت (إذا كان منتجType = 'bot')
  botProduct: {
    isBot: { type: Boolean, default: false },
    botPlatform: {
      type: String,
      enum: ['discord', 'whatsapp', 'slack', 'telegram', 'web', 'api', 'other'],
    },
    botFeatures: [String],
    botCommands: [String],
    installationUrl: String,
    setupGuide: String,
    apiEndpoint: String,
    apiKey: String,
    supportIncluded: { type: Boolean, default: true },
    supportDuration: { type: Number, default: 30 },
    customBot: { type: Boolean, default: false },
    botRequiresAuth: { type: Boolean, default: false }
  },
  
  // المجموعة (إذا كان productType = 'group')
  groupProduct: {
    isGroup: { type: Boolean, default: false },
    groupPlatform: {
      type: String,
      enum: ['discord', 'telegram', 'whatsapp', 'slack', 'website', 'other']
    },
    groupName: String,
    groupLink: String,
    groupDescription: String,
    maxMembers: Number,
    currentMembers: { type: Number, default: 0 },
    isPrivate: { type: Boolean, default: false },
    groupFeatures: [String],
    accessDuration: { type: Number, default: 30 },
    includesSupport: { type: Boolean, default: false },
    includesContent: { type: Boolean, default: true },
    contentUpdates: { type: Boolean, default: false }
  },
  
  // القناة (إذا كان productType = 'channel')
  channelProduct: {
    isChannel: { type: Boolean, default: false },
    channelPlatform: {
      type: String,
      enum: ['discord', 'telegram', 'youtube', 'whatsapp', 'website', 'other']
    },
    channelName: String,
    channelLink: String,
    channelDescription: String,
    subscriberCount: { type: Number, default: 0 },
    isPrivate: { type: Boolean, default: false },
    channelFeatures: [String],
    contentType: {
      type: String,
      enum: ['signals', 'news', 'educational', 'entertainment', 'updates', 'other']
    },
    contentFrequency: String,
    accessDuration: { type: Number, default: 30 },
    includesContent: { type: Boolean, default: true },
    contentUpdates: { type: Boolean, default: false }
  },
  
  // الوسائط
  images: [{
    url: String,
    alt: String,
    isPrimary: { type: Boolean, default: false }
  }],
  video: String,
  previewVideo: String,
  
  // المواصفات
  specifications: {
    type: Map,
    of: String
  },
  
  // التقييمات
  rating: { type: Number, default: 0, min: 0, max: 5 },
  reviewCount: { type: Number, default: 0 },
  reviews: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: { type: Number, min: 1, max: 5 },
    title: String,
    comment: String,
    images: [String],
    helpful: { type: Number, default: 0 },
    verified: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
  }],
  
  // الحالة
  status: {
    type: String,
    enum: ['draft', 'pending', 'approved', 'rejected', 'active', 'archived'],
    default: 'draft'
  },
  isFeatured: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  
  // SEO
  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String],
    canonicalUrl: String
  },
  
  // الإحصائيات
  stats: {
    views: { type: Number, default: 0 },
    sales: { type: Number, default: 0 },
    revenue: { type: Number, default: 0 },
    conversionRate: { type: Number, default: 0 }
  },
  
  // البائع
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  // الضمان والاسترجاع
  warranty: {
    enabled: { type: Boolean, default: false },
    duration: { type: Number, default: 30 },
    terms: String
  },
  refundPolicy: {
    enabled: { type: Boolean, default: true },
    duration: { type: Number, default: 14 },
    terms: String
  },
  
  // الأبعاد والوزن (للمنتجات المادية)
  dimensions: {
    length: Number,
    width: Number,
    height: Number,
    weight: Number
  },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Indexes
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ price: 1 });
productSchema.index({ category: 1 });
productSchema.index({ vendor: 1 });
productSchema.index({ status: 1 });
productSchema.index({ productType: 1 });
productSchema.index({ slug: 1 });

// Virtual for discount percentage
productSchema.virtual('discountPercentage').get(function() {
  if (this.comparePrice && this.comparePrice > this.price) {
    return Math.round(((this.comparePrice - this.price) / this.comparePrice) * 100);
  }
  return 0;
});

// Virtual for availability
productSchema.virtual('isAvailable').get(function() {
  if (this.allowOutOfStock) return true;
  return this.stock > 0;
});

// Pre-save hook
productSchema.pre('save', function(next) {
  if (!this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  
  if (!this.sku) {
    this.sku = 'SKU-' + Date.now().toString(36).toUpperCase();
  }
  
  this.updatedAt = new Date();
  next();
});

export default mongoose.model('Product', productSchema);
