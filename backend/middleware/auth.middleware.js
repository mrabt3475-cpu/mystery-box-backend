// Auth Middleware - SECURE
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const config = require('../config');
const { UnauthorizedError, ForbiddenError } = require('../utils/AppError');

const catchAsync = (fn) => (req, res, next) => {
  fn(req, res, next).catch(next);
};

// Protect routes - require authentication
const auth = catchAsync(async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    throw new UnauthorizedError('يرجى تسجيل الدخول أولاً');
  }

  // Use config for JWT secret
  const decoded = jwt.verify(token, config.jwtSecret);

  const user = await User.findById(decoded.id);
  if (!user || !user.isActive) {
    throw new UnauthorizedError('المستخدم غير موجود أو معطل');
  }

  req.user = {
    id: user._id,
    role: user.role,
    username: user.username
  };

  next();
});

// Require specific role
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new ForbiddenError('ليس لديك صلاحية لهذا الإجراء');
    }
    next();
  };
};

// Optional auth - attach user if token exists
const optionalAuth = catchAsync(async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, config.jwtSecret);
      const user = await User.findById(decoded.id);
      if (user && user.isActive) {
        req.user = { id: user._id, role: user.role, username: user.username };
      }
    } catch (err) {
      // Token invalid - continue without user
    }
  }

  next();
});

module.exports = { auth, requireRole, optionalAuth };