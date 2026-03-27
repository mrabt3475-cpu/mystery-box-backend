/* Points Routes
const express = require('express');

import authMiddleware from '../middleware/auth.middleware';
import pointsController from '../controllers/points.controller';

const pointsRouter = express.router();

// Get points balance
pointsRouter.get('/balance', authMiddleware, pointsController.getPointsBalance);

// Add points
pointsRouter.post('/add', authMiddleware, pointsController.addPoints);

// Deduct points (used for box opening)
pointsRouter.post('/deduct', authMiddleware, pointsController.deductPoints);

