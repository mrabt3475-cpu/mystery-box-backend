// Order Model
const mongoose = require('mongoose');
const config = require('../../config/constants');

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
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
  discount: {
    type: Number,
    default: 0,
  },
  pointsDiscount: {
    type: Number,
    default: 0,
  },
  total: {
    type: Number,
    required: true,
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
    transactionId: String,
    amount: Number,
    currency: { type: String, default: 'USD' },
    status: {
      type: String,
      enum: Object.values(config.PAYMENT_STATUS),
    },
    paidAt: Date,
  },
  shipping: {
    type: { type: String, default: 'digital' },
    email: String,
    address: String,
  },
  notes: String,
  ipAddress: String,
  userAgent: String,
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Indexes
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ user: 1 });
orderSchema.index({ channel: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ 'payment.transactionId': 1 });
orderSchema.index({ createdAt: -1 });

// Generate order number
orderSchema.statics.generateOrderNumber = async function() {
  const date = new Date();
  const prefix = `ORD${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}`;
  const count = await this.countDocuments({
    orderNumber: { $regex: `^${prefix}` },
  });
  return `${prefix}${(count + 1).toString().padStart(6, '0')}`;
};

// Virtual for items count
orderSchema.virtual('itemsCount').get(function() {
  return this.items.reduce((sum, item) => sum + item.quantity, 0);
});

module.exports = mongoose.model('Order', orderSchema);
