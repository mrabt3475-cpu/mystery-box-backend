import { Router } from 'express';
import User from '../modules/user/user.model.js';
import { authenticate, authorize } from '../../common/auth.middleware.js';

const router = Router();

// Get all users (admin)
router.get('/', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { page = 1, limit = 20, role, status } = req.query;
    
    const query = {};
    if (role) query.role = role;
    if (status) query.status = status;

    const users = await User.find(query)
      .select('-password')
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort('-createdAt');

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      data: users,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Get user by ID (admin)
router.get('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Update user (admin)
router.put('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { role, status, subscription } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role, status, subscription },
      { new: true }
    ).select('-password');
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Ban user (admin)
router.post('/:id/ban', authenticate, authorize('admin'), async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status: 'banned' },
      { new: true }
    ).select('-password');
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Unban user (admin)
router.post('/:id/unban', authenticate, authorize('admin'), async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status: 'active' },
      { new: true }
    ).select('-password');
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

export default router;
