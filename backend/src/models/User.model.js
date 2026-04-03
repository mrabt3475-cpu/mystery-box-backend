// User Model
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../../config/constants');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters'],
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false,
  },
  avatar: {
    type: String,
    default: '',
  },
  role: {
    type: String,
    enum: Object.values(config.USER_ROLES),
    default: config.USER_ROLES.USER,
  },
  status: {
    type: String,
    enum: Object.values(config.USER_STATUS),
    default: config.USER_STATUS.ACTIVE,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verificationToken: String,
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  subscription: {
    tier: {
      type: String,
      enum: Object.values(config.SUBSCRIPTION_TIERS),
      default: config.SUBSCRIPTION_TIERS.FREE,
    },
    expiresAt: Date,
  },
  wallet: {
    balance: { type: Number, default: 0 },
    points: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 },
    tonAddress: String,
    tonCreatedAt: Date,
  },
  stats: {
    totalOrders: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 },
    referralsCount: { type: Number, default: 0 },
    lastActiveAt: Date,
  },
  referralCode: {
    type: String,
    unique: true,
  },
  referredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  affiliates: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    commission: { type: Number, default: 0 },
  }],
  settings: {
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
    },
    language: { type: String, default: 'ar' },
    theme: { type: String, default: 'dark' },
  },
  lastLogin: Date,
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ referralCode: 1 });
userSchema.index({ 'stats.lastActiveAt': -1 });

// Virtual for user's referral link
userSchema.virtual('referralLink').get(function() {
  return `${process.env.CLIENT_URL || 'http://localhost:5173'}/register?ref=${this.referralCode}`;
});

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Pre-save middleware to generate referral code
userSchema.pre('save', async function(next) {
  if (!this.referralCode) {
    this.referralCode = this._id.toString(36).substring(2, 10).toUpperCase();
  }
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate JWT Token
userSchema.methods.getSignedJwtToken = function() {
  return jwt.sign({ id: this._id }, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRE,
  });
};

// Generate Refresh Token
userSchema.methods.getRefreshToken = function() {
  return jwt.sign({ id: this._id }, config.JWT_REFRESH_SECRET, {
    expiresIn: config.JWT_REFRESH_EXPIRE,
  });
};

// Update last active
userSchema.methods.updateLastActive = async function() {
  this.stats.lastActiveAt = new Date();
  await this.save();
};

module.exports = mongoose.model('User', userSchema);
