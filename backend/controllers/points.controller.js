const PointsTransaction = require('../models/pointsTransaction.model');
const User = require('../models/user.model');
const Box = require('../models/Box.model');

// Get user's points history
exports.getUserPoints = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('pointsBalance lifetimePoints');
    
    const transactions = await PointsTransaction.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      success: true,
      data: {
        balance: user.pointsBalance,
        lifetime: user.lifetimePoints,
        transactions
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Add points (Admin only)
exports.addPoints = async (req, res) => {
  try {
    const { userId, amount, type, description } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'المستخدم غير موجود'
      });
    }

    // Add points
    user.pointsBalance += amount;
    user.lifetimePoints += amount;
    await user.save();

    // Record transaction
    await PointsTransaction.create({
      user: userId,
      amount,
      type: type || 'admin_bonus',
      description: description || 'إضافة نقاط من الإدارة'
    });

    res.json({
      success: true,
      data: {
        newBalance: user.pointsBalance
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Deduct points (Admin only)
exports.deductPoints = async (req, res) => {
  try {
    const { userId, amount, reason } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'المستخدم غير موجود'
      });
    }

    if (user.pointsBalance < amount) {
      return res.status(400).json({
        success: false,
        error: 'رصيد المستخدم غير كافٍ'
      });
    }

    // Deduct points
    user.pointsBalance -= amount;
    await user.save();

    // Record transaction
    await PointsTransaction.create({
      user: userId,
      amount: -amount,
      type: 'admin_deduction',
      description: reason || 'خصم نقاط من الإدارة'
    });

    res.json({
      success: true,
      data: {
        newBalance: user.pointsBalance
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get all transactions (Admin)
exports.getAllTransactions = async (req, res) => {
  try {
    const { page = 1, limit = 50, userId, type } = req.query;
    
    const query = {};
    if (userId) query.user = userId;
    if (type) query.type = type;

    const transactions = await PointsTransaction.find(query)
      .populate('user', 'name email username')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await PointsTransaction.countDocuments(query);

    res.json({
      success: true,
      data: {
        transactions,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
