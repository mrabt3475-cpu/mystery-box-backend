import { Router } from 'express';
import { getUserNotifications, markAsRead, markAllAsRead } from '../notification/notification.service.js';
import { authenticate } from '../../common/auth.middleware.js';

const router = Router();

// Get notifications
router.get('/', authenticate, async (req, res) => {
  try {
    const { page, limit } = req.query;
    const result = await getUserNotifications(req.user._id, parseInt(page) || 1, parseInt(limit) || 20);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Mark as read
router.put('/:id/read', authenticate, async (req, res) => {
  try {
    const notification = await markAsRead(req.params.id, req.user._id);
    res.json({ success: true, data: notification });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Mark all as read
router.put('/read-all', authenticate, async (req, res) => {
  try {
    await markAllAsRead(req.user._id);
    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

export default router;
