// Product Routes
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { validate } = require('../../middleware/validation.middleware');
const { protect, authorize } = require('../../middleware/auth.middleware');
const productController = require('../../controllers/product.controller');

// @route   GET /api/v1/products
// @desc    Get all products
// @access  Public
router.get('/', productController.getProducts);

// @route   GET /api/v1/products/:id
// @desc    Get product by ID
// @access  Public
router.get('/:id', productController.getProduct);

// @route   POST /api/v1/products
// @desc    Create new product
// @access  Private (Channel Owner/Admin)
router.post(
  '/',
  protect,
  [
    body('name').trim().notEmpty().withMessage('Product name is required'),
    body('price').isNumeric().withMessage('Price must be a number'),
    body('channel').isMongoId().withMessage('Valid channel ID is required'),
  ],
  validate,
  productController.createProduct
);

// @route   PUT /api/v1/products/:id
// @desc    Update product
// @access  Private (Channel Owner/Admin)
router.put('/:id', protect, productController.updateProduct);

// @route   DELETE /api/v1/products/:id
// @desc    Delete product
// @access  Private (Channel Owner/Admin)
router.delete('/:id', protect, productController.deleteProduct);

// @route   GET /api/v1/products/featured
// @desc    Get featured products
// @access  Public
router.get('/featured/list', productController.getFeaturedProducts);


// @route   GET /api/v1/products/search
// @desc    Search products
// @access  Public
router.get('/search/all', productController.searchProducts);

// @route   GET /api/v1/products/category/:categoryId
// @desc    Get products by category
// @access  Public
router.get('/category/:categoryId', productController.getProductsByCategory);

module.exports = router;
