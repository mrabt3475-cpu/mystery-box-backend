import mongoose from 'mongoose';

const referralSchema = new mongoose.Schema({
  referrer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  referred: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reward: {
    referrer: { type: Number, default: 0 },
    referred: { type: Number, default: 0 }
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'cancelled'],
    default: 'pending'
  },
  level: {
    type: Number,
    default: 1
  }
}, {
  timestamps: true
});

// Prevent duplicate referrals
referralSchema.index({ referrer: 1, referred: 1 }, { unique: true });

export default mongoose.model('Referral', referralSchema);
