// Express App Configuration
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const config = require('./config/env');

const app = express();

// Body Parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Security Headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// Enable CORS
app.use(cors({
  origin: config.CLIENT_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Compress Responses
app.use(compression());

// Development Logging
if (config.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Sanitize MongoDB Queries
app.use(mongoSanitize());

// Prevent XSS
app.use(xss());

// Prevent HTTP Parameter Pollution
app.use(hpp());

// Health Check Route
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// API Routes (will be added in Phase 2)
app.use('/api/v1', (req, res) => {
  res.json({ message: 'PuzzleChain API v1', version: '1.0.0' });
});

// 404 Handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(config.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

module.exports = app;
