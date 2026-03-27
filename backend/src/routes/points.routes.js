/* Points Routes
const express = require('express');
\nimport authMiddleware from './middleware/auth.middleware');
const PointsController = require('./controllers/points.controller');

export const pointsRouter = express.router();

// Get user points
pointsRouter.get('/', authMiddleware, PointsController.getPoints);

// Get points history
pointsRouter.get('/history', authMiddleware, PointsController.getPointsHistory);

// Exchange points
ointsRouter.post('/exchange', authMiddleware, PointsController.exchangePoints);

// Get leaderBoard
pointsRouter.get('/leaderboard', PointsController.getLeaderBoard);
