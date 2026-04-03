// Input Sanitization

const sanitize = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .replace(/data:/gi, '')
    .trim();
};

const sanitizeObject = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  
  const sanitized = {};
  for (const key in obj) {
    if (typeof obj[key] === 'string') {
      sanitized[key] = sanitize(obj[key]);
    } else if (Array.isArray(obj[key])) {
      sanitized[key] = obj[key].map(item => 
        typeof item === 'string' ? sanitize(item) : item
      );
    } else if (typeof obj[key] === 'object') {
      sanitized[key] = sanitizeObject(obj[key]);
    } else {
      sanitized[key] = obj[key];
    }
  }
  return sanitized;
};

// NoSQL Injection Prevention
const preventNoSQLInjection = (value) => {
  if (typeof value === 'string') {
    // Block common NoSQL operators
    const blocked = ['$where', '$function', '$eval', '$command', '$regex'];
    for (const op of blocked) {
      if (value.toLowerCase().includes(op.toLowerCase())) {
        return '';
      }
    }
  }
  return value;
};

const sanitizeQuery = (query) => {
  const sanitized = {};
  for (const key in query) {
    sanitized[key] = preventNoSQLInjection(query[key]);
  }
  return sanitized;
};

module.exports = {
  sanitize,
  sanitizeObject,
  preventNoSQLInjection,
  sanitizeQuery
};
