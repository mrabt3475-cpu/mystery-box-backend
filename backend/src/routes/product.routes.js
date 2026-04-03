// Product Routes
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { validate } = require('../middleware/validation.middleware');
const { protect } = require('../middleware/auth.middleware');
const productController = require('../controllers/product.controller');

// Validation
const createProductValidation = [
  body('name').trim().notEmpty().withMessage('Product name is required'),
  body('price').isNumeric().withMessage('Price is required'),
  body('channel').isMongoId().withMessage('Valid channel is required'),
];

// Routes
router.get('/', productController.getProducts);
router.get('/:id', productController.getProduct);
router.post('/', protect, createProductValidation, validate, productController.createProduct);
router.put('/:id', protect, productController.updateProduct);
router.delete('/:id', protect, productController.deleteProduct);

module.exports = router;
