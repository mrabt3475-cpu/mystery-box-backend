const Box = require('../models/Box.model');
const User = require('../models/user.model');
const BoxOpening = require('../models/BoxOpening.model');
const RewardsService = require('../services/rewards.service');

// Get all boxes
exports.getAllBoxes = async (req, res) => {
  try {
    const boxes = await Box.find({ isActive: true })
      .sort({ order: 1, createdAt: -1 })
      .select('-prizes');
    
    res.json({
      success: true,
      data: boxes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get single box with prizes
exports.getBoxById = async (req, res) => {
  try {
    const box = await Box.findById(req.params.id)
      .populate('prizes.prizeId');
    
    if (!box) {
      return res.status(404).json({
        success: false,
        error: 'الصندوق غير موجود'
      });
    }

    res.json({
      success: true,
      data: box
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Open box and get prize
exports.openBox = async (req, res) => {
  try {
    const { boxId } = req.params;
    const userId = req.user.id;

    const box = await Box.findById(boxId);
    if (!box || !box.isActive) {
      return res.status(404).json({
        success: false,
        error: 'الصندوق غير متاح'
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'المستخدم غير موجود'
      });
    }

    // Check points balance
    if (user.pointsBalance < box.cost) {
      return res.status(400).json({
        success: false,
        error: 'رصيدك غير كافٍ'
      });
    }

    // Deduct points
    user.pointsBalance -= box.cost;
    await user.save();

    // Get prize using Provably Fair RNG
    const prize = await RewardsService.selectPrize(box);

    // Record opening
    const opening = await BoxOpening.create({
      user: userId,
      box: boxId,
      prize: prize._id,
      cost: box.cost,
      status: 'completed'
    });

    // Update prize stats
    prize.timesOpened = (prize.timesOpened || 0) + 1;
    await prize.save();

    res.json({
      success: true,
      data: {
        opening,
        prize,
        remainingBalance: user.pointsBalance
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Admin: Create box
exports.createBox = async (req, res) => {
  try {
    const box = await Box.create(req.body);
    
    res.status(201).json({
      success: true,
      data: box
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Admin: Update box
exports.updateBox = async (req, res) => {
  try {
    const box = await Box.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!box) {
      return res.status(404).json({
        success: false,
        error: 'الصندوق غير موجود'
      });
    }

    res.json({
      success: true,
      data: box
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Admin: Delete box
exports.deleteBox = async (req, res) => {
  try {
    const box = await Box.findByIdAndDelete(req.params.id);
    
    if (!box) {
      return res.status(404).json({
        success: false,
        error: 'الصندوق غير موجود'
      });
    }

    res.json({
      success: true,
      message: 'تم حذف الصندوق'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
