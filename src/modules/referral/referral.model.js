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
  code: {
    type: String,
    required: true
  },
  reward: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'cancelled'],
    default: 'pending'
  }
}, {
  timestamps: true
});

export const Referral = mongoose.model('Referral', referralSchema);

// Generate referral code
export const generateReferralCode = () => {
  return 'REF' + Math.random().toString(36).substring(2, 8).toUpperCase();
};

// Get referral stats
export const getReferralStats = async (userId) => {
  const referrals = await Referral.find({ referrer: userId, status: 'completed' });
  
  return {
    totalReferrals: referrals.length,
    totalEarnings: referrals.reduce((sum, r) => sum + r.reward, 0),
    pendingReferrals: await Referral.countDocuments({ referrer: userId, status: 'pending' })
  };
};
