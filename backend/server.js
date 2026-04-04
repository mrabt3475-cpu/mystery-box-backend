require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
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
const { globalErrorHandler, notFoundHandler, errorLogger } = require('./middleware/errorHandler.middleware');
const { sanitizeRequest, preventNoSQLInjection } = require('./middleware/sanitize.middleware');

// Import performance optimizations
const { createIndexes } = require('./config/databaseIndexes');
const { cacheMiddleware } = require('./services/cache.service');

const app = express();

// =======================
// PERFORMANCE MIDDLEWARE
// =======================

// Compression - reduce response size by ~70%
app.use(compression({
  level: 6,
  threshold: 1024,
  filter: (req, res) => {
    if (req.headers['x-no-compression']) return false;
    return compression.filter(req, res);
  }
}));

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
      connectSrc: ["'self'", "https:", "wss:"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

// CORS configuration - SECURE
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = process.env.ALLOWED_ORIGINS 
      ? process.env.ALLOWED_ORIGINS.split(',')
      : ['http://localhost:5173', 'http://localhost:3000'];
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('غير مسموح بـ CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};
app.use(cors(corsOptions));

// Rate limiting - SECURE
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { success: false, error: 'تجاوزت الحد المسموح من الطلبات' },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.path === '/health'
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, error: 'طلبات تسجيل دخول كثيرة' },
});

const sensitiveLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  message: { success: false, error: 'طلبات كثيرة' },
});

app.use('/api/', apiLimiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
app.use('/api/points/add', sensitiveLimiter);
app.use('/api/points/deduct', sensitiveLimiter);
app.use('/api/gifts/send', sensitiveLimiter);

// Body parsing with limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Input sanitization
app.use(sanitizeRequest);
app.use(preventNoSQLInjection);

// Remove sensitive headers
app.use((req, res, next) => {
  res.removeHeader('x-powered-by');
  res.removeHeader('X-Powered-By');
  next();
});

// =======================
// DATABASE CONNECTION
// =======================

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/puzzlechain';
    
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };
    
    await mongoose.connect(mongoUri, options);
    console.log('✅ MongoDB connected successfully');
    
    // Create indexes on startup
    await createIndexes();
    
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

// =======================
// API ROUTES (with caching)
// =======================

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    memory: process.memoryUsage()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Cached routes (boxes, prizes, products - read-heavy)
app.use('/api/boxes', cacheMiddleware('boxes', 60), boxRoutes);
app.use('/api/prizes', cacheMiddleware('prizes', 60), prizeRoutes);
app.use('/api/products', cacheMiddleware('products', 30), productRoutes);

// Non-cached routes (mutations)
app.use('/api/orders', orderRoutes);
app.use('/api/points', pointsRoutes);
app.use('/api/gifts', giftRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/api-keys', apiKeyRoutes);

// =======================
// ERROR HANDLING
// =======================

app.use(errorLogger);
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
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔒 Security: Enabled`);
    console.log(`⚡ Performance: Optimized\n`);
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