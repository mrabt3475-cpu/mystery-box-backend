const express = require('express');
const router = express.Router();
const Box = require('../models/Box.model');
const BoxOpening = require('../models/BoxOpening.model');
const User = require('../models/user.model');
const RewardsService = require('../services/rewards.service');
const { auth } = require('../middleware/auth.middleware');
const { body, validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, error: errors.array()[0].msg });
  }
  next();
};

// Get all boxes
router.get('/', async (req, res) => {
  try {
    const boxes = await Box.find({ isActive: true })
      .sort({ order: 1 })
      .select('-prizes');
    res.json({ success: true, data: boxes });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get box by ID
router.get('/:id', async (req, res) => {
  try {
    const box = await Box.findById(req.params.id).populate('prizes.prizeId');
    if (!box) {
      return res.status(404).json({ success: false, error: 'الصندوق غير موجود' });
    }
    res.json({ success: true, data: box });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Open box
router.post('/:id/open',
  auth,
  async (req, res) => {
    try {
      const box = await Box.findById(req.params.id);
      if (!box || !box.isActive) {
        return res.status(404).json({ success: false, error: 'الصندوق غير متاح' });
      }

      const user = await User.findById(req.user.id);
      if (user.pointsBalance < box.cost) {
        return res.status(400).json({ success: false, error: 'رصيدك غير كافٍ' });
      }

      // Deduct points
      user.pointsBalance -= box.cost;
      user.stats.boxesOpened += 1;
      user.stats.totalSpent += box.cost;
      await user.save();

      // Get prize
      const prize = await RewardsService.selectPrize(box);

      // Record opening
      const opening = await BoxOpening.create({
        user: user._id,
        box: box._id,
        prize: prize._id,
        cost: box.cost,
        seed: RewardsService.generateSeed(),
        serverSeed: RewardsService.generateSeed(),
        clientSeed: req.body.clientSeed || RewardsService.generateSeed(),
        nonce: 1
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
      res.status(500).json({ success: false, error: error.message });
    }
  }
);

// Admin: Create box
router.post('/',
  auth,
  async (req, res) => {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ success: false, error: 'غير مصرح' });
      }
      const box = await Box.create(req.body);
      res.status(201).json({ success: true, data: box });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
);

// Admin: Update box
router.put('/:id',
  auth,
  async (req, res) => {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ success: false, error: 'غير مصرح' });
      }
      const box = await Box.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json({ success: true, data: box });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
);

// Admin: Delete box
router.delete('/:id',
  auth,
  async (req, res) => {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ success: false, error: 'غير مصرح' });
      }
      await Box.findByIdAndDelete(req.params.id);
      res.json({ success: true, message: 'تم حذف الصندوق' });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
);

module.exports = router;
