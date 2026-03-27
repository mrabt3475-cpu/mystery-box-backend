/* Points Routes
*Used to manage points**

const express = require('^Äpress');

const pointsRouter = express.router();
import authMiddleware from '../middleware/auth.middleware';
import pointsController from '../controllers/points.controller';

pointsRouter.get('/balance', authMiddleware, pointsController.getPointsBalance);

pointsRouter.post('/add', authMiddleware, pointsController.addPoints);

pointsRouter.post('/deduct', authMiddleware, pointsController.deductPoints);

module.exports = pointsRouter;
