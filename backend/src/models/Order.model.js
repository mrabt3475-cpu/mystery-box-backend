// Order Model
const mongoose = require('mongoose');
const config = require('../../config/constants');

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  channel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Channel',
  },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    price: Number,
    quantity: { type: Number, default: 1 },
    image: String,
  }],
  subtotal: {
    type: Number,
    required: true,
  },
  tax: {
    type: Number,
    default: 0,
  },
  discount: {
    type: Number,
    default: 0,
  },
  total: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    default: 'USD',
  },
  status: {
    type: String,
    enum: Object.values(config.ORDER_STATUS),
    default: config.ORDER_STATUS.PENDING,
  },
  payment: {
    method: {
      type: String,
      enum: Object.values(config.PAYMENT_METHODS),
    },
    status: {
      type: String,
      enum: Object.values(config.PAYMENT_STATUS),
      default: config.PAYMENT_STATUS.PENDING,
    },
    transactionId: String,
    paidAt: Date,
    cardLast4: String,
  },
  customer: {
    email: String,
    name: String,
  },
  shipping: {
    type: { type: String, default: 'digital' },
    address: String,
  },
  coupon: {
    code: String,
    discount: Number,
  },
  pointsUsed: {
    type: Number,
    default: 0,
  },
  pointsEarned: {
    type: Number,
    default: 0,
  },
  notes: String,
}, {
  timestamps: true,
});

// Indexes
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ channel: 1 });
orderSchema.index({ 'payment.status': 1 });
orderSchema.index({ status: 1 });

// Generate order number before saving
orderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    const date = new Date();
    const prefix = `ORD-${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}`;
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    this.orderNumber = `${prefix}-${random}`;
  }
  next();
});

// Static method to calculate points earned
orderSchema.statics.calculatePointsEarned = function(total) {
  return Math.floor(total * 0.05); // 5% of total as points
};

module.exports = mongoose.model('Order', orderSchema);
