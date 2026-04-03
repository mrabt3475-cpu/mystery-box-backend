const crypto = require('crypto');
const ApiKey = require('../models/ApiKey.model');
const { UnauthorizedError } = require('../utils/errors');

// Generate API key
const generateApiKey = (prefix = 'pk') => {
  const timestamp = Date.now().toString(36);
  const random = crypto.randomBytes(16).toString('hex');
  return `${prefix}_${timestamp}_${random}`;
};

// API Key authentication middleware
const apiKeyAuth = async (req, res, next) => {
  try {
    const apiKey = req.headers['x-api-key'];
    
    if (!apiKey) {
      throw new UnauthorizedError('API key مطلوب');
    }

    // Find key in database
    const keyDoc = await ApiKey.findOne({ key: apiKey, isActive: true });
    
    if (!keyDoc) {
      throw new UnauthorizedError('API key غير صالح');
    }

    // Check expiration
    if (keyDoc.expiresAt && new Date() > keyDoc.expiresAt) {
      throw new UnauthorizedError('API key منتهي الصلاحية');
    }

    // Check rate limit
    const now = Date.now();
    const windowMs = 60 * 1000; // 1 minute
    const rateLimit = keyDoc.rateLimit || 100;
    
    // Simple rate limit check
    if (keyDoc.lastUsed) {
      const timeSinceLastUse = now - new Date(keyDoc.lastUsed).getTime();
      if (timeSinceLastUse < windowMs && keyDoc.usageCount >= rateLimit) {
        throw new UnauthorizedError('Rate limit exceeded');
      }
    }

    // Update usage
    keyDoc.lastUsed = new Date();
    keyDoc.usageCount = keyDoc.lastUsed && (now - new Date(keyDoc.lastUsed).getTime() < windowMs) 
      ? keyDoc.usageCount + 1 
      : 1;
    await keyDoc.save();

    // Attach key info to request
    req.apiKey = {
      id: keyDoc._id,
      user: keyDoc.user,
      permissions: keyDoc.permissions
    };

    next();
  } catch (error) {
    if (error.statusCode === 401) {
      res.status(401).json({ success: false, error: error.message });
    } else {
      next(error);
    }
  }
};

// Check permission
const checkPermission = (...requiredPermissions) => {
  return (req, res, next) => {
    if (!req.apiKey) {
      return next(new UnauthorizedError('API key مطلوب'));
    }

    const hasPermission = requiredPermissions.every(perm => 
      req.apiKey.permissions.includes(perm)
    );

    if (!hasPermission) {
      return next(new UnauthorizedError('صلاحيات غير كافية'));
    }

    next();
  };
};

module.exports = { generateApiKey, apiKeyAuth, checkPermission };
