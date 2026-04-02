const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cors = require('cors');

export const securityMiddleware = (app) => {
  // Security headers
  app.use(helmet({
    contentSecurityPolicy: false,
  }));

  // CORS
  app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  }));

  // Rate limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: { error: 'Too many requests, please try again later.' }
  });
  app.use('/api', limiter);
};
