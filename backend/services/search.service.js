// Enhanced Search Service with Advanced Filtering
// ==================================================

const Product = require('../models/Product.model');
const { logger } = require('../utils/logger');

class SearchService {
  // Advanced search with multiple filters
  async searchProducts(options) {
    const {
      query = '',
      category = null,
      minPrice = null,
      maxPrice = null,
      inStock = false,
      sortBy = 'relevance',
      page = 1,
      limit = 20,
      tags = []
    } = options;

    const mongoQuery = { isActive: true };

    // 1. Text Search (name, description, tags, brand)
    if (query && query.trim()) {
      const searchRegex = new RegExp(query.trim(), 'i');
      mongoQuery.$or = [
        { name: searchRegex },
        { description: searchRegex },
        { tags: { $in: [searchRegex] } },
        { brand: searchRegex },
        { category: searchRegex },
        { sku: searchRegex }
      ];
    }

    // 2. Category Filter
    if (category && category !== 'all') {
      mongoQuery.category = category;
    }

    // 3. Price Range Filter
    if (minPrice !== null || maxPrice !== null) {
      mongoQuery.price = {};
      if (minPrice !== null) mongoQuery.price.$gte = minPrice;
      if (maxPrice !== null) mongoQuery.price.$lte = maxPrice;
    }

    // 4. Stock Filter
    if (inStock) {
      mongoQuery.stock = { $gt: 0 };
    }

    // 5. Tags Filter
    if (tags && tags.length > 0) {
      mongoQuery.tags = { $in: tags.map(t => new RegExp(t, 'i')) };
    }

    // 6. Sorting
    let sortOption = {};
    switch (sortBy) {
      case 'price_asc':
        sortOption = { price: 1 };
        break;
      case 'price_desc':
        sortOption = { price: -1 };
        break;
      case 'newest':
        sortOption = { createdAt: -1 };
        break;
      case 'rating':
        sortOption = { rating: -1 };
        break;
      case 'name':
        sortOption = { name: 1 };
        break;
      default:
        sortOption = { name: 1 };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [products, total] = await Promise.all([
      Product.find(mongoQuery)
        .sort(sortOption)
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Product.countDocuments(mongoQuery)
    ]);

    const totalPages = Math.ceil(total / parseInt(limit));

    logger.info(`Search completed: ${products.length} results for query "${query}"`);

    return {
      products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages,
        hasNext: parseInt(page) < totalPages,
        hasPrev: parseInt(page) > 1
      },
      filters: {
        query,
        category,
        priceRange: { minPrice, maxPrice },
        inStock,
        tags
      }
    };
  }

  // Get search suggestions (autocomplete)
  async getSuggestions(query, limit = 10) {
    if (!query || query.trim().length < 2) {
      return [];
    }

    const searchRegex = new RegExp('^' + query.trim(), 'i');
    
    const suggestions = await Product.find({
      isActive: true,
      $or: [
        { name: searchRegex },
        { brand: searchRegex }
      ]
    })
    .select('name brand category image')
    .limit(limit)
    .lean();

    return suggestions.map(p => ({
      name: p.name,
      brand: p.brand,
      category: p.category,
      image: p.image
    }));
  }

  // Get popular search terms
  async getPopularCategories() {
    const categories = await Product.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    return categories.map(c => ({
      name: c._id,
      count: c.count
    }));
  }

  // Search by barcode/SKU
  async searchBySKU(sku) {
    const product = await Product.findOne({
      isActive: true,
      $or: [
        { sku: sku },
        { barcode: sku }
      ]
    });

    return product;
  }
}

module.exports = new SearchService();