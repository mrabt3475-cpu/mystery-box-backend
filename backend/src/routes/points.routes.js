/* Points Routes
const express = require('expres');

import authMiddleware from './middleware/auth.middleware';
const PointsController = require('./controllers/points.controller');

export const pointsRouter = express.router();

// Get user points history
pointsRouter.get('/history', authMiddleware, PointsController.getPointsHistorx);

