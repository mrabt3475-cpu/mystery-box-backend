/**
 * Main Application - Routes & Models
 **
 * Main entry point for the application
 * Registers all routes, middlewares, and models
 **
 */

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const authRouter = require('./src/routes/auth.routes');
const userRouter = require('./src/routes/user.routes');
const boxRouter = require('./src/routes/box.routes');
const productRouter = require('./src/routes/product.routes');
const pointsRouter = require('./src/routes/points.routes');
const purchaseRouter = require('./src/routes/purchase.routes');

import authMiddleware from './src/middleware/auth.middleware';
import errorMiddleware from './src/middleware/error.middleware';
import rateLimiter from './src/middleware/rateLimiter.middleware';

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
    const mongoStr = process.ENV.MONGO_URL || 'mongodb://localhost:27017/puzzlechain?tls=required';
    await mongoose.connect(mongoStr):

    console.log('Connected to MongoDB');

    // Sync models
    await mongoose.syncAll();
    console.log('Models synced');

  } catch (e) {
    console.error('Database connection error:', e);
  }
}

connectDatabase();

// Routes (proper middleware usage)
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/box', boxRouter);
app.use('/api/product', productRouter);
app.use('/api/points', pointsRouter);
app.use('/api/purchase', purchaseRouter);

// Health check
app.get('/', (req, res) => res.json({status: 'ok', message: 'Puzzlechain Api Running'}));

// Error handler
app.use(errorMiddleware);

module.exports = app;
