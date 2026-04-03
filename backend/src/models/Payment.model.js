// Payment Model
const mongoose = require('mongoose');
const config = require('../../config/constants');

const paymentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
  },
  amount: {
    type: Number,
    required: true,
    min: [0, 'Amount cannot be negative'],
  },
  currency: {
    type: String,
    default: 'USD',
  },
  method: {
    type: String,
    enum: Object.values(config.PAYMENT_METHODS),
    required: true,
  },
  status: {
    type: String,
    enum: Object.values(config.PAYMENT_STATUS),
    default: config.PAYMENT_STATUS.PENDING,
  },
  transactionId: {
    type: String,
    unique: true,
  },
  gatewayResponse: {
    type: mongoose.Schema.Types.Mixed,
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
  },
  paidAt: Date,
  failedAt: Date,
  refundedAt: Date,
  refundAmount: Number,
  ipAddress: String,
  userAgent: String,
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Indexes
paymentSchema.index({ user: 1 });
paymentSchema.index({ order: 1 });
paymentSchema.index({ transactionId: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ createdAt: -1 });

// Static method to create transaction ID
paymentSchema.statics.createTransactionId = async function() {
  const prefix = 'PAY';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}${timestamp}${random}`;
};

module.exports = mongoose.model('Payment', paymentSchema);
