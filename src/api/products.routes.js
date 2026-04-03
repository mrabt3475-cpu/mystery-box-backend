import { Router } from 'express';
import Product from '../modules/product/product.model.js';
import { authenticate, authorize } from '../../common/auth.middleware.js';

const router = Router();

// Get all products - Public
router.get('/', async (req, res) => {
  try {
    const { category, channel, search, page = 1, limit = 20 } = req.query;
    
    const query = { status: 'active' };
    if (category) query.category = category;
    if (channel) query.channel = channel;
    if (search) query.$text = { $search: search };

    const products = await Product.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort('-isFeatured -createdAt');

    const total = await Product.countDocuments(query);

    res.json({
      success: true,
      data: products,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Get product by ID - Public
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    // Increment views
    product.stats.views += 1;
    await product.save();
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Create product - FIXED: Admin only
router.post('/', authenticate, authorize('admin', 'owner'), async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Update product - FIXED: Admin only
router.put('/:id', authenticate, authorize('admin', 'owner'), async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Delete product - FIXED: Admin only
router.delete('/:id', authenticate, authorize('admin', 'owner'), async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

export default router;
