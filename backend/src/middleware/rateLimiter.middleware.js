// Rate Limiting Middleware
const rateLimit = require('express-rate-limit');
const config = require('../config/env');

// General API Rate Limiter
exports.apiLimiter = rateLimit({
  windowMs: config.RATE_LIMIT_WINDOW,
  max: config.RATE_LIMIT_MAX,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Strict limiter for auth routes
exports.authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts
  message: {
    success: false,
    message: 'Too many login attempts, please try again after 15 minutes',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Limiter for payment routes
exports.paymentLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: {
    success: false,
    message: 'Too many payment requests, please try again later',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Limiter for box opening
exports.boxLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,
  message: {
    success: false,
    message: 'Too many box openings, please wait a moment',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
