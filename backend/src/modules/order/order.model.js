import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: String,
  sku: String,
  image: String,
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  total: {
    type: Number,
    required: true
  },
  // نوع المنتج في الطلب
  productType: {
    type: String,
    enum: ['physical', 'digital', 'bot', 'group', 'channel', 'subscription']
  },
  // تفاصيل خاصة بالمنتج الرقمي
  digitalDetails: {
    downloadUrl: String,
    downloadExpiry: Date,
    downloadCount: { type: Number, default: 0 },
    accessToken: String
  },
  // تفاصيل خاصة بالبوت
  botDetails: {
    botToken: String,
    installationUrl: String,
    apiKey: String,
    setupGuide: String
  },
  // تفاصيل خاصة بالمجموعة
  groupDetails: {
    groupLink: String,
    groupName: String,
    accessExpiry: Date,
    accessToken: String
  },
  // تفاصيل خاصة بالقناة
  channelDetails: {
    channelLink: String,
    channelName: String,
    accessExpiry: Date,
    accessToken: String
  },
  // تفاصيل الاشتراك
  subscriptionDetails: {
    isSubscription: { type: Boolean, default: false },
    billingCycle: String,
    nextBillingDate: Date,
    cancelAt: Date,
    subscriptionId: String
  }
});

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true
  },
  
  // المستخدم
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  guestEmail: String,
  guestName: String,
  
  // المنتجات
  items: [orderItemSchema],
  
  // العنوان
  shippingAddress: {
    firstName: String,
    lastName: String,
    address1: String,
    address2: String,
    city: String,
    state: String,
    postalCode: String,
    country: String,
    phone: String
  },
  
  // الفواتير
  subtotal: Number,
  shippingCost: Number,
  tax: Number,
  discount: Number,
  total: Number,
  currency: {
    type: String,
    default: 'USD'
  },
  
  // الدفع
  payment: {
    method: {
      type: String,
      enum: ['card', 'paypal', 'crypto', 'wallet', 'free']
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded', 'cancelled']
    },
    transactionId: String,
    paidAt: Date,
    paymentDetails: mongoose.Schema.Types.Mixed
  },
  
  // الكوبونات
  coupon: {
    code: String,
    discount: Number,
    discountType: { type: String, enum: ['percentage', 'fixed'] }
  },
  
  // الحالة
  status: {
    type: String,
    enum: [
      'pending',
      'confirmed',
      'processing',
      'ready',
      'shipped',
      'delivered',
      'completed',
      'cancelled',
      'refunded',
      'failed'
    ],
    default: 'pending'
  },
  
  // ملاحظات
  notes: String,
  adminNotes: String,
  
  // التتبع
  trackingNumber: String,
  trackingUrl: String,
  shippedAt: Date,
  deliveredAt: Date,
  
  // الفاتورة
  invoice: {
    invoiceNumber: String,
    invoiceUrl: String,
    issuedAt: Date
  },
  
  // المرتجع
  refund: {
    reason: String,
    amount: Number,
    requestedAt: Date,
    processedAt: Date,
    processedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  
  // المصدر
  source: {
    type: String,
    enum: ['website', 'api', 'telegram', 'mobile'],
    default: 'website'
  },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Index
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ user: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ 'payment.status': 1 });
orderSchema.index({ createdAt: -1 });

// Pre-save
orderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    const date = new Date();
    const prefix = 'ORD';
    const timestamp = date.getTime().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    this.orderNumber = `${prefix}-${timestamp}-${random}`;
  }
  this.updatedAt = new Date();
  next();
});

export default mongoose.model('Order', orderSchema);
