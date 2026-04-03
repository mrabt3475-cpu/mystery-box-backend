// Environment Configuration - SECURE VERSION
require('dotenv').config();

const requiredVars = [
  'NODE_ENV',
  'PORT',
  'MONGODB_URI',
  'JWT_SECRET',
  'JWT_REFRESH_SECRET'
];

// Check for required environment variables on startup
const missingVars = requiredVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error(`Missing required environment variables: ${missingVars.join(', ')}`);
  console.error('Please copy .env.example to .env and fill in the values');
  process.exit(1);
}

// Generate secure random secrets if not provided
const generateSecret = (length = 32) => {
  return require('crypto').randomBytes(length).toString('hex');
};

module.exports = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT) || 3000,
  
  // Database
  MONGODB_URI: process.env.MONGODB_URI,
  MONGODB_URI_TEST: process.env.MONGODB_URI_TEST,
  
  // JWT - SECURE: No fallback secrets
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRE: process.env.JWT_EXPIRE || '7d',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  JWT_REFRESH_EXPIRE: process.env.JWT_REFRESH_EXPIRE || '30d',
  
  // Redis (for rate limiting and sessions)
  REDIS_URL: process.env.REDIS_URL,
  
  // Client URL
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  
  // Stripe - Required for production
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
  
  // Internal API Key (for admin operations)
  INTERNAL_API_KEY: process.env.INTERNAL_API_KEY || generateSecret(32),
  
  // Rate Limiting
  RATE_LIMIT_WINDOW: parseInt(process.env.RATE_LIMIT_WINDOW) || 15 * 60 * 1000,
  RATE_LIMIT_MAX: parseInt(process.env.RATE_LIMIT_MAX) || 100,
  
  // Logging
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
};
