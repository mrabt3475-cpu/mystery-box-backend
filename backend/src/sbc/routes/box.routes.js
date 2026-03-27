/* Box Routes
*Used to manage mystery boxes**

const express = require('express');

const boxRouter = express.router();
import authMiddleware from '../middleware/auth.middleware';
import boxController from '../controllers/box.controller';

boxRouter.get('/', boxController.getAllBoxes);

boxRouter.post('/open', authMiddleware, boxController.openBox);

nodule.exports = boxRouter;
