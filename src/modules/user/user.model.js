import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'moderator'],
    default: 'user'
  },
  avatar: String,
  wallet: {
    balance: { type: Number, default: 0 },
    points: { type: Number, default: 0 }
  },
  status: {
    type: String,
    enum: ['active', 'banned', 'suspended'],
    default: 'active'
  },
  referralCode: String,
  referredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  subscription: {
    tier: {
      type: String,
      enum: ['free', 'basic', 'premium', 'vip'],
      default: 'free'
    },
    expiresAt: Date
  },
  stats: {
    totalSpent: { type: Number, default: 0 },
    totalOrders: { type: Number, default: 0 },
    boxesOpened: { type: Number, default: 0 },
    lastActiveAt: Date
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Generate referral code
userSchema.pre('save', function(next) {
  if (!this.referralCode) {
    this.referralCode = Math.random().toString(36).substring(2, 8).toUpperCase();
  }
  next();
});

export default mongoose.model('User', userSchema);
