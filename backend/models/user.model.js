const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30,
    index: true
  },
  email: {
    type: String,
    sparse: true,
    trim: true,
    lowercase: true,
    index: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  avatar: { type: String, default: null },
  phone: String,
  role: {
    type: String,
    enum: ['user', 'moderator', 'admin'],
    default: 'user',
    index: true
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  pointsBalance: { type: Number, default: 0, min: 0 },
  lifetimePoints: { type: Number, default: 0, min: 0 },
  referralCode: { type: String, unique: true, index: true },
  referredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  preferences: {
    notifications: { type: Boolean, default: true },
    language: { type: String, default: 'ar' },
    theme: { type: String, default: 'dark' }
  },
  stats: {
    boxesOpened: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 },
    totalWon: { type: Number, default: 0 },
    giftsSent: { type: Number, default: 0 },
    giftsReceived: { type: Number, default: 0 }
  },
  loginAttempts: { type: Number, default: 0 },
  lockUntil: { type: Date, default: null },
  lastLogin: { type: Date, default: null }
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

// Indexes
userSchema.index({ createdAt: -1 });
userSchema.index({ pointsBalance: -1 });
userSchema.index({ 'stats.boxesOpened': -1 });

// Hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.isLocked = function() {
  return this.lockUntil && this.lockUntil > Date.now();
};

userSchema.methods.incrementLoginAttempts = async function() {
  if (this.lockUntil && this.lockUntil < Date.now()) {
    await this.updateOne({ $set: { loginAttempts: 1 }, $unset: { lockUntil: 1 } });
    return;
  }
  const updates = { $inc: { loginAttempts: 1 } };
  if (this.loginAttempts + 1 >= 5) {
    updates.$set = { lockUntil: new Date(Date.now() + 15 * 60 * 1000) };
  }
  await this.updateOne(updates);
};

userSchema.methods.resetLoginAttempts = async function() {
  await this.updateOne({ $set: { loginAttempts: 0 }, $unset: { lockUntil: 1 } });
};

userSchema.virtual('referralLink').get(function() {
  return `https://t.me/yourbot?ref=${this.referralCode}`;
});

module.exports = mongoose.model('User', userSchema);