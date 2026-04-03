// Product Routes
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { validate } = require('../middleware/validation.middleware');
const { protect, authorize } = require('../middleware/auth.middleware');
const productController = require('../controllers/product.controller');

// Validation
const productValidation = [
  body('name').trim().notEmpty().withMessage('Product name is required'),
  body('price').isNumeric().withMessage('Price must be a number'),
  body('channel').optional(),
];

// Routes
router.get('/', productController.getProducts);
router.get('/:id', productController.getProduct);
router.post('/', protect, productValidation, validate, productController.createProduct);
router.put('/:id', protect, productController.updateProduct);
router.delete('/:id', protect, productController.deleteProduct);

module.exports = router;
