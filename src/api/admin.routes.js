import { Router } from 'express';
import { getDashboardStats, getRevenueAnalytics } from '../analytics/analytics.service.js';
import { authenticate, authorize } from '../../common/auth.middleware.js';

const router = Router();

// Dashboard stats (admin only)
router.get('/dashboard', authenticate, authorize('admin'), async (req, res) => {
  try {
    const stats = await getDashboardStats();
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Revenue analytics
router.get('/revenue', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { days } = req.query;
    const revenue = await getRevenueAnalytics(parseInt(days) || 30);
    res.json({ success: true, data: revenue });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

export default router;
