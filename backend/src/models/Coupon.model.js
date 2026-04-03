// Coupon Model
const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    uppercase: true,
    trim: true,
  },
  description: String,
  discountType: {
    type: String,
    enum: ['percentage', 'fixed'],
    required: true,
  },
  discountValue: {
    type: Number,
    required: true,
    min: [0, 'Discount value cannot be negative'],
  },
  maxDiscount: Number,
  minOrderValue: {
    type: Number,
    default: 0,
  },
  usageLimit: {
    type: Number,
    default: -1, // -1 means unlimited
  },
  usedCount: {
    type: Number,
    default: 0,
  },
  userUsageLimit: {
    type: Number,
    default: 1,
  },
  applicableTo: {
    type: String,
    enum: ['all', 'products', 'categories', 'channels'],
    default: 'all',
  },
  applicableIds: [{
    type: mongoose.Schema.Types.ObjectId,
  }],
  channel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Channel',
  },
  validFrom: {
    type: Date,
    default: Date.now,
  },
  validUntil: {
    type: Date,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

// Indexes
couponSchema.index({ code: 1 });
couponSchema.index({ channel: 1 });
couponSchema.index({ isActive: 1 });
couponSchema.index({ validUntil: 1 });

// Method to validate coupon
couponSchema.methods.validate = function(orderTotal, userId, userUsageCount) {
  const now = new Date();
  
  // Check if active
  if (!this.isActive) {
    return { valid: false, message: 'Coupon is not active' };
  }
  
  // Check validity period
  if (now < this.validFrom || now > this.validUntil) {
    return { valid: false, message: 'Coupon has expired' };
  }
  
  // Check usage limit
  if (this.usageLimit !== -1 && this.usedCount >= this.usageLimit) {
    return { valid: false, message: 'Coupon usage limit reached' };
  }
  
  // Check user usage limit
  if (userUsageCount >= this.userUsageLimit) {
    return { valid: false, message: 'You have already used this coupon' };
  }
  
  // Check minimum order value
  if (orderTotal < this.minOrderValue) {
    return { valid: false, message: `Minimum order value is ${this.minOrderValue}` };
  }
  
  // Calculate discount
  let discount = 0;
  if (this.discountType === 'percentage') {
    discount = (orderTotal * this.discountValue) / 100;
    if (this.maxDiscount) {
      discount = Math.min(discount, this.maxDiscount);
    }
  } else {
    discount = this.discountValue;
  }
  
  return { valid: true, discount };
};

module.exports = mongoose.model('Coupon', couponSchema);
