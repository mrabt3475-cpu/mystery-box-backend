import { Router } from 'express';
import User from '../modules/user/user.model.js';
import Transaction from '../modules/economy/transaction.model.js';
import { authenticate } from '../../common/auth.middleware.js';


const router = Router();

// Get wallet balance
router.get('/', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({
      success: true,
      data: {
        balance: user.wallet.balance,
        points: user.wallet.points,
        tonAddress: user.wallet.tonAddress
      }
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Get transaction history
router.get('/transactions', authenticate, async (req, res) => {
  try {
    const { page = 1, limit = 20, type } = req.query;
    
    const query = { user: req.user._id };
    if (type) query.type = type;

    const transactions = await Transaction.find(query)
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Transaction.countDocuments(query);

    res.json({
      success: true,
      data: transactions,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Add points (admin only)
router.post('/add-points', authenticate, async (req, res) => {
  try {
    const { userId, amount, description } = req.body;
    
    const user = await User.findById(userId);
    user.wallet.points += amount;
    await user.save();

    // Record transaction
    await Transaction.create({
      user: userId,
      type: 'reward',
      amount,
      currency: 'POINTS',
      status: 'completed',
      method: 'admin',
      description: description || 'Points added by admin'
    });

    res.json({ success: true, data: { points: user.wallet.points } });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Deduct points (admin only)
router.post('/deduct-points', authenticate, async (req, res) => {
  try {
    const { userId, amount, description } = req.body;
    
    const user = await User.findById(userId);
    if (user.wallet.points < amount) {
      return res.status(400).json({ success: false, error: 'Insufficient points' });
    }

    user.wallet.points -= amount;
    await user.save();

    // Record transaction
    await Transaction.create({
      user: userId,
      type: 'purchase',
      amount: -amount,
      currency: 'POINTS',
      status: 'completed',
      method: 'admin',
      description: description || 'Points deducted by admin'
    });

    res.json({ success: true, data: { points: user.wallet.points } });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

export default router;
