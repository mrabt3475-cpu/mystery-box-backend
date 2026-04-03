const crypto = require('crypto');
const ApiKey = require('../models/ApiKey.model');

const apiKeyAuth = async (req, res, next) => {
  try {
    const apiKey = req.headers['x-api-key'];
    
    if (!apiKey) {
      return res.status(401).json({ success: false, error: 'API key required' });
    }

    const keyDoc = await ApiKey.findOne({ key: apiKey, isActive: true });
    
    if (!keyDoc) {
      return res.status(401).json({ success: false, error: 'Invalid API key' });
    }

    // Check expiration
    if (keyDoc.expiresAt && new Date(keyDoc.expiresAt) < new Date()) {
      return res.status(401).json({ success: false, error: 'API key expired' });
    }

    // Update last used
    keyDoc.lastUsed = new Date();
    keyDoc.usageCount += 1;
    await keyDoc.save();

    req.apiKey = keyDoc;
    next();
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Generate new API key
const generateApiKey = (prefix = 'pk') => {
  const key = crypto.randomBytes(32).toString('hex');
  return `${prefix}_${key}`;
};

module.exports = { apiKeyAuth, generateApiKey };
