const express = require('express');
const router = express.Router();
const PointsTransaction = require('../models/pointsTransaction.model');
const User = require('../models/user.model');
const { auth } = require('../middleware/auth.middleware');

// Get user's points
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('pointsBalance lifetimePoints');
    const transactions = await PointsTransaction.find({ user: req.user.id }).sort({ createdAt: -1 }).limit(50);
    res.json({ success: true, data: { balance: user.pointsBalance, lifetime: user.lifetimePoints, transactions } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Add points (Admin)
router.post('/add', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ success: false, error: 'غير مصرح' });
    const { userId, amount, type, description } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, error: 'المستخدم غير موجود' });

    user.pointsBalance += amount;
    user.lifetimePoints += amount;
    await user.save();

    await PointsTransaction.create({
      user: userId, amount, type: type || 'admin_bonus',
      description: description || 'إضافة نقاط من الإدارة', balanceAfter: user.pointsBalance
    });

    res.json({ success: true, data: { newBalance: user.pointsBalance } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Deduct points (Admin)
router.post('/deduct', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ success: false, error: 'غير مصرح' });
    const { userId, amount, reason } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, error: 'المستخدم غير موجود' });
    if (user.pointsBalance < amount) return res.status(400).json({ success: false, error: 'رصيد المستخدم غير كافٍ' });

    user.pointsBalance -= amount;
    await user.save();

    await PointsTransaction.create({
      user: userId, amount: -amount, type: 'admin_deduction',
      description: reason || 'خصم نقاط من الإدارة', balanceAfter: user.pointsBalance
    });

    res.json({ success: true, data: { newBalance: user.pointsBalance } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
