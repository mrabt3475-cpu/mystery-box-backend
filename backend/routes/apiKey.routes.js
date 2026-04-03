const express = require('express');
const router = express.Router();
const ApiKey = require('../models/ApiKey.model');
const { auth } = require('../middleware/auth.middleware');
const { generateApiKey } = require('../middleware/apiKey.middleware');

// Get user's API keys
router.get('/', auth, async (req, res) => {
  try {
    const keys = await ApiKey.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, data: keys });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create API key
router.post('/', auth, async (req, res) => {
  try {
    const { name, permissions, rateLimit, expiresAt } = req.body;
    
    const key = generateApiKey('pk');
    const prefix = key.substring(0, 8);
    
    const apiKey = await ApiKey.create({
      user: req.user.id,
      name,
      key,
      prefix,
      permissions: permissions || ['read'],
      rateLimit: rateLimit || 100,
      expiresAt
    });

    res.status(201).json({
      success: true,
      data: {
        ...apiKey.toObject(),
        fullKey: key // Only shown once!
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Revoke API key
router.delete('/:id', auth, async (req, res) => {
  try {
    const apiKey = await ApiKey.findOne({ _id: req.params.id, user: req.user.id });
    if (!apiKey) {
      return res.status(404).json({ success: false, error: 'المفتاح غير موجود' });
    }

    apiKey.isActive = false;
    await apiKey.save();

    res.json({ success: true, message: 'تم إلغاء المفتاح' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
