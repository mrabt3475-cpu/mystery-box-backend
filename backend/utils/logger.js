// Logging Utility with levels

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  green: '\x1b[32m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m'
};

const getTimestamp = () => new Date().toISOString();

const logger = {
  error: (...args) => {
    if (process.env.NODE_ENV !== 'test') {
      console.error(colors.red('[ERROR]'), ...args);
    }
  },
  
  warn: (...args) => {
    if (process.env.NODE_ENV !== 'test') {
      console.warn(colors.yellow('[WARN]'), ...args);
    }
  },
  
  info: (...args) => {
    if (process.env.NODE_ENV !== 'test') {
      console.log(colors.blue('[INFO]'), ...args);
    }
  },
  
  success: (...args) => {
    if (process.env.NODE_ENV !== 'test') {
      console.log(colors.green('[SUCCESS]'), ...args);
    }
  },
  
  debug: (...args) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(colors.gray('[DEBUG]'), ...args);
    }
  }
};

// Request logger middleware
const requestLogger = (req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const statusColor = res.statusCode >= 400 ? colors.red : colors.green;
    logger.debug(`${req.method} ${req.originalUrl}`, res.statusCode, `${duration}ms`);
  });

  next();
};

module.exports = { logger, requestLogger };