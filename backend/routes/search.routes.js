const express = require('express');
const router = express.Router();
const searchService = require('../services/search.service');
const { catchAsync } = require('../middleware/errorHandler.middleware');
const { formatSuccess, formatPaginated } = require('../utils/responseFormatter');

// Advanced search endpoint
router.get('/search', catchAsync(async (req, res) => {
  const {
    q,
    category,
    minPrice,
    maxPrice,
    inStock,
    sort,
    page = 1,
    limit = 20,
    tags
  } = req.query;

  const result = await searchService.searchProducts({
    query: q,
    category,
    minPrice: minPrice ? parseFloat(minPrice) : null,
    maxPrice: maxPrice ? parseFloat(maxPrice) : null,
    inStock: inStock === 'true',
    sortBy: sort,
    page: parseInt(page),
    limit: Math.min(parseInt(limit), 100),
    tags: tags ? tags.split(',').map(t => t.trim()) : []
  });

  res.json(formatSuccess(result));
}));

// Search suggestions (autocomplete)
router.get('/suggestions', catchAsync(async (req, res) => {
  const { q, limit = 10 } = req.query;
  
  if (!q || q.trim().length < 2) {
    return res.json(formatSuccess([]));
  }

  const suggestions = await searchService.getSuggestions(q, parseInt(limit));
  res.json(formatSuccess(suggestions));
}));

// Popular categories
router.get('/categories', catchAsync(async (req, res) => {
  const categories = await searchService.getPopularCategories();
  res.json(formatSuccess(categories));
}));

// Search by SKU/Barcode
router.get('/sku/:code', catchAsync(async (req, res) => {
  const product = await searchService.searchBySKU(req.params.code);
  
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }
  
  res.json(formatSuccess(product));
}));

module.exports = router;