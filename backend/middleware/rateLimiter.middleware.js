const rateLimit = require('express-rate-limit');
const { TooManyRequestsError } = require('../utils/errors');

// General API rate limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: { success: false, error: 'Too many requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: 'Too many requests, please try again later'
    });
  }
});

// Auth routes limiter (stricter)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 attempts per window
  message: { success: false, error: 'Too many login attempts, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: 'Too many login attempts, please try again later'
    });
  }
});

// Box opening limiter
const boxLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // 10 boxes per minute
  message: { success: false, error: 'Please wait before opening more boxes' },
  standardHeaders: true,
  legacyHeaders: false
});

// Gift sending limiter
const giftLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 5, // 5 gifts per minute
  message: { success: false, error: 'Please wait before sending more gifts' },
  standardHeaders: true,
  legacyHeaders: false
});

// Points operations limiter
const pointsLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20, // 20 operations per minute
  message: { success: false, error: 'Too many points operations' },
  standardHeaders: true,
  legacyHeaders: false
});

module.exports = {
  apiLimiter,
  authLimiter,
  boxLimiter,
  giftLimiter,
  pointsLimiter
};
