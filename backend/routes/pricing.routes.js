const express = require('express');
const router = express.Router();
const pricingService = require('../services/pricing.service');
const { auth, adminAuth } = require('../middleware/auth.middleware');
const { catchAsync } = require('../middleware/errorHandler.middleware');
const { formatSuccess } = require('../utils/responseFormatter');

// Get product with pricing info
router.get('/product/:id', catchAsync(async (req, res) => {
  const product = await pricingService.getProductWithPricing(req.params.id);
  res.json(formatSuccess(product));
}));

// Get all products with pricing
router.get('/products', catchAsync(async (req, res) => {
  const products = await pricingService.getProductsWithPricing();
  res.json(formatSuccess(products));
}));

// Calculate profit for order
router.get('/order/:orderId/profit', auth, catchAsync(async (req, res) => {
  const profitInfo = await pricingService.calculateOrderProfit(req.params.orderId);
  res.json(formatSuccess(profitInfo));
}));

// Get pricing analytics (admin)
router.get('/analytics', auth, adminAuth, catchAsync(async (req, res) => {
  const analytics = await pricingService.getPricingAnalytics();
  res.json(formatSuccess(analytics));
}));

// Calculate bulk discount
router.post('/bulk-discount', catchAsync(async (req, res) => {
  const { quantity, unitPrice, tiers } = req.body;
  
  if (!quantity || !unitPrice) {
    return res.status(400).json({ 
      success: false, 
      message: 'Quantity and unitPrice are required' 
    });
  }

  const result = pricingService.calculateBulkDiscount(quantity, unitPrice, tiers);
  res.json(formatSuccess(result));
}));

// Format price for display
router.get('/format/:price', catchAsync(async (req, res) => {
  const { currency = 'SAR' } = req.query;
  const formatted = pricingService.formatPrice(parseFloat(req.params.price), currency);
  res.json(formatSuccess(formatted));
}));

module.exports = router;