// Referral Controller - FIXED VERSION
import User from '../modules/user/user.model.js';
import Referral from '../modules/referral/referral.model.js';
import { AppError } from '../middleware/error.middleware.js';

// Get referral stats
const getReferralStats = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const referrals = await Referral.find({ referrer: userId })
      .populate('referred', 'name email createdAt');
    
    const stats = {
      totalReferrals: referrals.length,
      activeReferrals: referrals.filter(r => r.status === 'active').length,
      totalEarnings: referrals.reduce((sum, r) => sum + (r.commission || 0), 0),
      pendingEarnings: referrals
        .filter(r => r.status === 'pending')
        .reduce((sum, r) => sum + (r.commission || 0), 0),
    };
    
    res.json({ success: true, data: { stats, referrals } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Generate referral link
const generateReferralLink = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user.referralCode) {
      user.referralCode = 'REF' + Date.now().toString(36).toUpperCase();
      await user.save();
    }
    
    const referralLink = `${process.env.CLIENT_URL}/register?ref=${user.referralCode}`;
    
    res.json({ success: true, data: { referralCode: user.referralCode, referralLink } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Apply referral (when new user registers)
const applyReferral = async (referrerId, referredId) => {
  try {
    const referrer = await User.findById(referrerId);
    const referred = await User.findById(referredId);
    
    if (!referrer || !referred) return;
    
    // Create referral record
    await Referral.create({
      referrer: referrerId,
      referred: referredId,
      status: 'pending',
      commission: 0,
    });
    
    // Update referrer stats
    referrer.referralCount = (referrer.referralCount || 0) + 1;
    await referrer.save();
  } catch (error) {
    console.error('Error applying referral:', error);
  }
};

// Get my referrals
const getMyReferrals = async (req, res) => {
  try {
    const referrals = await Referral.find({ referrer: req.user._id })
      .populate('referred', 'name email createdAt wallet.balance')
      .sort('-createdAt');
    
    res.json({ success: true, data: referrals });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export {
  getReferralStats,
  generateReferralLink,
  applyReferral,
  getMyReferrals,
};
