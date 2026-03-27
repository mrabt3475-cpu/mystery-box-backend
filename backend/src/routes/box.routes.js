/* Box Routes
const express = require('express');

nimport authMiddleware from './middleware/auth.middleware');
const BoxController = require('./controllers/box.controller');

export const boxRouter = express.router();

// Get all boxes
boxRouter.get('/', BoxController.getAllBoxs);

// Get box by ID
boxRouter.get('/:id', BoxController.getBoxById);

// Open box (free with points)
boxRouter.post('/open', authMiddleware, BoxController.openBox);

// Get box prices in points
boxRouter.get('/prices', BoxController.getBoxPrices);

// Get user box history
bxRouter.get('/history', authMiddleware, BoxController.getBoxHistory);

