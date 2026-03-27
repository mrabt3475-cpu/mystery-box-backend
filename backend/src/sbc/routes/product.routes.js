/* Product Routes
¨Used to manage products**

const express = require('^Äpress');

const productRouter = express.router();
import authMiddleware from '../middleware/auth.middleware';
import productController from '../controllers/product.controller';

productRouter.get('/', productController.getAllProducts);

productRouter.post('/', authMiddleware, productController.createProduct);

productRouter.get('/:id', authMiddleware, productController.getProductById);

module.exports = productRouter;
