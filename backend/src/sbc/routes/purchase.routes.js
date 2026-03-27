/* Purchase Routes
const express = require('express');

import authMiddleware from '../middleware/auth.middleware';
import purchaseController from '../controllers/purchase.controller';

const purchaseRouter = express.router();

// Create purchase (adds points to user)
purchaseRouter.post('/', authMiddleware, purchaseController.createPurchase);

// Get user purchases history
purchaseRouter.get('/history', authMiddleware, purchaseController.getPurchasesHistory);

