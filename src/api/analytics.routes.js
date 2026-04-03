import express from 'express';
import { authenticate, authorize } from '../common/auth.middleware.js';
import * as analyticsService from '../modules/analytics/analytics.service.js';

const router = express.Router();

// Get dashboard stats
router.get('/stats', authenticate, authorize('admin'), async (req, res) => {
  try {
    const stats = await analyticsService.getDashboardStats();
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Get revenue analytics
router.get('/revenue', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const revenue = await analyticsService.getRevenueAnalytics(parseInt(days));
    res.json({ success: true, data: revenue });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Get top products
router.get('/top-products', authenticate, authorize('admin'), async (req, res) => {
  try {
    const products = await analyticsService.getTopProducts();
    res.json({ success: true, data: products });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

export default router;
