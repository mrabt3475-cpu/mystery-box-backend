// Catch Async Wrapper - prevents try-catch repetition

const catchAsync = (fn) => (req, res, next) => {
  fn(req, res, next).catch(next);
};

// Global Error Handler
const globalErrorHandler = (err, req, res, next) => {
  // Log error for debugging
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', err);
  }

  // Default error
  let error = { ...err };
  error.message = err.message;

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    error = new AppError('معرف غير صالح', 400);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    error = new AppError(`حقل ${field} مستخدم مسبقاً`, 409);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    error = new AppError(messages.join(', '), 400);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = new AppError('رمز غير صالح', 401);
  }

  if (err.name === 'TokenExpiredError') {
    error = new AppError('انتهت صلاحية الرمز', 401);
  }

  // Operational errors
  const statusCode = error.statusCode || 500;
  const message = process.env.NODE_ENV === 'production' && !error.isOperational
    ? 'خطأ داخلي في الخادم'
    : error.message;

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

// Not Found Handler
const notFoundHandler = (req, res, next) => {
  const error = new AppError(`المسار ${req.originalUrl} غير موجود`, 404);
  next(error);
};

const { AppError } = require('./errors');

module.exports = {
  catchAsync,
  globalErrorHandler,
  notFoundHandler
};
