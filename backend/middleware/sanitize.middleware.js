// Input Sanitization
const sanitizeHtml = require('sanitize-html');

const sanitizeInput = (input) => {
  if (typeof input === 'string') {
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+=/gi, '')
      .trim();
  }
  return input;
};

const sanitizeObject = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  
  const sanitized = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];
      if (typeof value === 'string') {
        sanitized[key] = sanitizeInput(value);
      } else if (Array.isArray(value)) {
        sanitized[key] = value.map(item => 
          typeof item === 'string' ? sanitizeInput(item) : item
        );
      } else if (typeof value === 'object' && value !== null) {
        sanitized[key] = sanitizeObject(value);
      } else {
        sanitized[key] = value;
      }
    }
  }
  return sanitized;
};

// Middleware to sanitize all inputs
const sanitizeRequest = (req, res, next) => {
  if (req.body) req.body = sanitizeObject(req.body);
  if (req.query) req.query = sanitizeObject(req.query);
  if (req.params) req.params = sanitizeObject(req.params);
  next();
};

// NoSQL Injection prevention
const preventNoSQLInjection = (req, res, next) => {
  const checkForInjection = (obj) => {
    if (!obj) return true;
    
    for (const key in obj) {
      const value = obj[key];
      if (typeof value === 'string') {
        // Check for MongoDB operators
        if (value.startsWith('$')) {
          return false;
        }
        // Check for regex patterns that could be injection
        if (value.includes('{"$')) {
          return false;
        }
      }
      if (typeof value === 'object' && !checkForInjection(value)) {
        return false;
      }
    }
    return true;
  };

  if (!checkForInjection(req.body) || !checkForInjection(req.query)) {
    return res.status(400).json({
      success: false,
      error: 'طلب غير صالح'
    });
  }

  next();
};

module.exports = {
  sanitizeInput,
  sanitizeObject,
  sanitizeRequest,
  preventNoSQLInjection
};
