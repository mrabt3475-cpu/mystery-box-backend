/* Main Application - Routes & Models
**
 * Main entry point for the application
 * Registers all routes, middlewares, and models
**

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// Import routes
const authRouter = require('./sbc/routes/auth.routes');
const userRouter = require('./sbc/routes/user.routes');
const boxRouter = require('./sbc/routes/box.routes');
const productRouter = require('./sbc/routes/product.routes');
const pointsRouter = require('./sbc/routes/points.routes');
const purchaseRouter = require('./sbc/routes/purchase.routes');

// Import middlewares
const authMiddleware = require('./sbc/middleware/auth.middleware');
const errorMiddleware = require('./sbc/middleware/error.middleware');
const rateLimiter = require('./sbc/middleware/rateLimiter.middleware');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Rate Limiting
const rateLimit = rateLimiter();
app.use(rateLimit);

// Connect to Database
async function connectDatabase() {
  try {
    const mongoStr = process.env.MONGO_URL || 'mongodb://localhost:27017/puzzlechain?tls=false';
    await mongoose.connect(mongoStr);

    console.log('Connected to MongoDB');

    // Sync models
    await mongoose.syncAll();
    console.log('Models synced');

  } catch (e) {
    console.error('Database connection error:', e);
  }
}

connectDatabase();

// Routes
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/box', boxRouter);
app.use('/api/product', productRouter);
app.use('/api/points', pointsRouter);
app.use('/api/purchase', purchaseRouter);

// Health check
app.get('/', (req, res) => res.json({ status: 'ok', message: 'Puzzlechain Api Running' }));

// Error handler
app.use(errorMiddleware);

module.exports = app;
