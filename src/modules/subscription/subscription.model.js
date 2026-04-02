import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tier: {
    type: String,
    enum: ['free', 'basic', 'premium', 'vip'],
    default: 'free'
  },
  status: {
    type: String,
    enum: ['active', 'cancelled', 'expired'],
    default: 'active'
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: Date,
  monthlyPrice: {
    type: Number,
    default: 0
  },
  features: {
    dailyBoxOpens: { type: Number, default: 1 },
    maxChannels: { type: Number, default: 1 },
    discount: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

export const Subscription = mongoose.model('Subscription', subscriptionSchema);

// Subscription plans
export const PLANS = {
  free: {
    name: 'Free',
    monthlyPrice: 0,
    features: {
      dailyBoxOpens: 1,
      maxChannels: 1,
      discount: 0
    }
  },
  basic: {
    name: 'Basic',
    monthlyPrice: 9.99,
    features: {
      dailyBoxOpens: 5,
      maxChannels: 3,
      discount: 5
    }
  },
  premium: {
    name: 'Premium',
    monthlyPrice: 24.99,
    features: {
      dailyBoxOpens: 20,
      maxChannels: 10,
      discount: 15
    }
  },
  vip: {
    name: 'VIP',
    monthlyPrice: 49.99,
    features: {
      dailyBoxOpens: 100,
      maxChannels: 50,
      discount: 30
    }
  }
};
