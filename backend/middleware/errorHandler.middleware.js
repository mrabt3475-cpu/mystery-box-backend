// Catch Async - Wrapper for async route handlers
const catchAsync = (fn) => (req, res, next) => {
  fn(req, res, next).catch(next);
};

// Global Error Handler
const globalErrorHandler = (err, req, res, next) => {
  // Log error in development
  if (process.env.NODE_ENV === 'development') {
    console.error('❌ Error:', err);
  }

  // Operational errors (known errors)
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message,
      statusCode: err.statusCode
    });
  }

  // Programming errors (unknown)
  console.error('💥 Programming Error:', err);
  
  res.status(500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' 
      ? 'خطأ في الخادم' 
      : err.message,
    statusCode: 500
  });
};

// Not Found Handler
const notFoundHandler = (req, res, next) => {
  const error = new Error(`المسار ${req.originalUrl} غير موجود`);
  error.statusCode = 404;
  next(error);
};

// Error Logger
const errorLogger = (err, req, res, next) => {
  if (process.env.NODE_ENV === 'production') {
    const logData = {
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.originalUrl,
      ip: req.ip,
      error: {
        message: err.message,
        stack: err.stack
      }
    };
    console.log('📝 Error Log:', JSON.stringify(logData));
  }
  next(err);
};

module.exports = {
  catchAsync,
  globalErrorHandler,
  notFoundHandler,
  errorLogger
};
