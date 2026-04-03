const rateLimit = require('express-rate-limit');

// Different rate limits for different endpoints
const createRateLimiter = (options = {}) => {
  return rateLimit({
    windowMs: options.windowMs || 15 * 60 * 1000,
    max: options.max || 100,
    message: { success: false, error: 'Too many requests' },
    standardHeaders: true,
    legacyHeaders: false,
  });
};

// API rate limiter
const apiLimiter = createRateLimiter({ max: 100 });

// Auth rate limiter
const authLimiter = createRateLimiter({ max: 10, windowMs: 15 * 60 * 1000 });

// Box opening rate limiter
const boxLimiter = createRateLimiter({ max: 20, windowMs: 60 * 1000 });

module.exports = {
  apiLimiter,
  authLimiter,
  boxLimiter,
  createRateLimiter
};
