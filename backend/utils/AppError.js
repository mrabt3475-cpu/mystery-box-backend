// Custom Error Classes

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

class NotFoundError extends AppError {
  constructor(resource = 'Resource') {
    super(`${resource} غير موجود`, 404);
  }
}

class ValidationError extends AppError {
  constructor(message) {
    super(message, 400);
  }
}

class UnauthorizedError extends AppError {
  constructor(message = 'غير مصرح لك') {
    super(message, 401);
  }
}

class ForbiddenError extends AppError {
  constructor(message = 'وصول مرفوض') {
    super(message, 403);
  }
}

class ConflictError extends AppError {
  constructor(message = 'تعارض في البيانات') {
    super(message, 409);
  }
}

class InsufficientFundsError extends AppError {
  constructor() {
    super('رصيدك غير كافٍ', 400);
  }
}

class TooManyRequestsError extends AppError {
  constructor(message = 'طلبات كثيرة جداً') {
    super(message, 429);
  }
}

module.exports = {
  AppError,
  NotFoundError,
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
  ConflictError,
  InsufficientFundsError,
  TooManyRequestsError
};
