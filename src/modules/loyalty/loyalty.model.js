import mongoose from 'mongoose';

const loyaltySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  points: {
    type: Number,
    default: 0
  },
  tier: {
    type: String,
    enum: ['bronze', 'silver', 'gold', 'platinum', 'diamond'],
    default: 'bronze'
  },
  lifetimeSpent: {
    type: Number,
    default: 0
  },
  history: [{
    points: Number,
    type: { type: String, enum: ['earned', 'redeemed', 'expired', 'bonus'] },
    description: String,
    date: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true
});

// Auto-update tier based on lifetime spent
loyaltySchema.pre('save', function(next) {
  if (this.lifetimeSpent >= 10000) this.tier = 'diamond';
  else if (this.lifetimeSpent >= 5000) this.tier = 'platinum';
  else if (this.lifetimeSpent >= 2000) this.tier = 'gold';
  else if (this.lifetimeSpent >= 500) this.tier = 'silver';
  else this.tier = 'bronze';
  next();
});

export default mongoose.model('Loyalty', loyaltySchema);
