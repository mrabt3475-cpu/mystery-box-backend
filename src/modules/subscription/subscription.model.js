import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  tier: {
    type: String,
    enum: ['free', 'basic', 'premium', 'vip'],
    default: 'free'
  },
  plan: {
    name: String,
    price: Number,
    duration: Number // in days
  },
  status: {
    type: String,
    enum: ['active', 'cancelled', 'expired'],
    default: 'active'
  },
  startedAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    required: true
  },
  autoRenew: {
    type: Boolean,
    default: false
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'crypto', 'wallet']
  }
}, {
  timestamps: true
});

// Check if subscription is valid
subscriptionSchema.methods.isValid = function() {
  return this.status === 'active' && this.expiresAt > new Date();
};

export default mongoose.model('Subscription', subscriptionSchema);
