require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');

// Import routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const boxRoutes = require('./routes/box.routes');
const prizeRoutes = require('./routes/prize.routes');
const productRoutes = require('./routes/product.routes');
const orderRoutes = require('./routes/order.routes');
const pointsRoutes = require('./routes/points.routes');
const giftRoutes = require('./routes/gift.routes');
const serviceRoutes = require('./routes/service.routes');
const apiKeyRoutes = require('./routes/apiKey.routes');

// Import middleware
const { apiLimiter, authLimiter, boxLimiter, giftLimiter, pointsLimiter } = require('./middleware/rateLimiter.middleware');
const { globalErrorHandler, notFoundHandler } = require('./utils/errorHandler');
const { requestLogger } = require('./utils/logger');
const { sanitizeObject, sanitizeQuery } = require('./utils/sanitization');

const app = express();

// =======================
// SECURITY MIDDLEWARE
// =======================

// Helmet with improved security
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

// CORS configuration - restrict in production
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key'],
};
app.use(cors(corsOptions));

// Body parsing with size limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
app.use(requestLogger);

// Input sanitization
app.use((req, res, next) => {
  res.removeHeader('x-powered-by');
  
  if (req.body) {
    req.body = sanitizeObject(req.body);
  }
  
  if (req.query) {
    req.query = sanitizeQuery(req.query);
  }
  
  next();
});

// =======================
// RATE LIMITING
// =======================

app.use('/api/', apiLimiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
app.use('/api/boxes', boxLimiter);
app.use('/api/gifts', giftLimiter);
app.use('/api/points', pointsLimiter);

// =======================
// DATABASE CONNECTION
// =======================

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/puzzlechain';
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

// =======================
// API ROUTES
// =======================


// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/boxes', boxRoutes);
app.use('/api/prizes', prizeRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/points', pointsRoutes);
app.use('/api/gifts', giftRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/api-keys', apiKeyRoutes);

// =======================
// ERROR HANDLING
// =======================

app.use(notFoundHandler);
app.use(globalErrorHandler);

// =======================
// SERVER STARTUP
// =======================

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  await connectDB();
  
  app.listen(PORT, () => {
    console.log(`\n🚀 Server running on port ${PORT}`);
    console.log(`📱 Health check: http://localhost:${PORT}/health`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}\n`);
  });
};

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});

startServer();

module.exports = app;
