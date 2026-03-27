/* Product Routes
const express = require('express');

import authMiddleware from './middleware/auth.middleware');
const ProductController = require('./controllers/product.controller');

export const productRouter = express.router();

// Get all products
productRouter.get('/', ProductController.getAllProducts);

// Buy product
productRouter.post('/buy', authMiddleware, ProductController.buyProduct);

// Get user purchase history
productRouter.get('/history', authMiddleware, ProductController.getPurchaseHistory);

