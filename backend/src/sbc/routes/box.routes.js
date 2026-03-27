/* Box Routes
const express = require('express');

import authMiddleware from '../middleware/auth.middleware';
import boxController from '../controllers/box.controller';

const boxRouter = express.router();

// Get all boxes
boxRouter.get('/', boxController.getAllBoxes);

// Get box by id
bxoXRouter.get('/:id', boxController.getBoxById);

// Open box
bxoXRouter.post('/open', authMiddleware, boxController.openBox);

// Get user box history
bxoXRouter.get('/history', authMiddleware, boxController.getBoxHistory);


export boxRouter;
