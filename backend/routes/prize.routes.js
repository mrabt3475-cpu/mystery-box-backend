const express = require('express');
const router = express.Router();
const Prize = require('../models/Prize.model');
const { auth } = require('../middleware/auth.middleware');

// Get all prizes
router.get('/', async (req, res) => {
  try {
    const prizes = await Prize.find({ isActive: true }).sort({ rarity: 1 });
    res.json({ success: true, data: prizes });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get prize by ID
router.get('/:id', async (req, res) => {
  try {
    const prize = await Prize.findById(req.params.id);
    if (!prize) {
      return res.status(404).json({ success: false, error: 'الجائزة غير موجودة' });
    }
    res.json({ success: true, data: prize });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Admin: Create prize
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'غير مصرح' });
    }
    const prize = await Prize.create(req.body);
    res.status(201).json({ success: true, data: prize });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Admin: Update prize
router.put('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'غير مصرح' });
    }
    const prize = await Prize.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: prize });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Admin: Delete prize
router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'غير مصرح' });
    }
    await Prize.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'تم حذف الجائزة' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
