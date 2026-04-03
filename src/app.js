import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import { securityMiddleware } from './common/security.middleware.js';
import { errorHandler } from './common/error.handler.js';
import { connectDB } from './common/database.js';

// Routes
import authRoutes from './api/auth.routes.js';
import boxesRoutes from './api/boxes.routes.js';
import ordersRoutes from './api/orders.routes.js;
import productsRoutes from './api/products.routes.js';
import adminRoutes from './api/admin.routes.js';
import leaderboardRoutes from './api/leaderboard.routes.js';
import notificationsRoutes from './api/notifications.routes.js';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Security
securityMiddleware(app);

// Database
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/boxes', boxesRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/notifications', notificationsRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Error handler
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
