const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const { UnauthorizedError, ForbiddenError } = require('../utils/errors');

// Protect routes - require authentication
const auth = catchAsync(async (req, res, next) => {
  // Get token from header
  let token;
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    throw new UnauthorizedError('يرجى تسجيل الدخول أولاً');
  }

  // Verify token
  const jwtSecret = process.env.JWT_SECRET || 'default-secret';
  const decoded = jwt.verify(token, jwtSecret);

  // Get user
  const user = await User.findById(decoded.id);
  if (!user || !user.isActive) {
    throw new UnauthorizedError('المستخدم غير موجود أو معطل');
  }

  // Attach user to request
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
      const jwtSecret = process.env.JWT_SECRET || 'default-secret';
      const decoded = jwt.verify(token, jwtSecret);
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

const catchAsync = (fn) => (req, res, next) => {
  fn(req, res, next).catch(next);
};

module.exports = { auth, requireRole, optionalAuth };
