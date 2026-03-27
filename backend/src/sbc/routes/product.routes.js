/* Product Routes
const express = require('express');

import authMiddleware from '../middleware/auth.middleware';
import productController from '../controllers/product.controller';

const productRouter = express.router();

// Get all products
productRouter.get('/', productController.getAllProducts);

// Create product
productRouter.post('/', authMiddleware, productController.createProduct);

// Get product by idProductRouter.get('/:id', authMiddleware, productController.getProductById);

