import { Router } from 'express';
import { register, login } from '../auth/auth.service.js';
import { authenticate } from '../../common/auth.middleware.js';

const router = Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, referralCode } = req.body;
    const result = await register({ name, email, password, referralCode });
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await login(email, password);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(401).json({ success: false, error: error.message });
  }
});

// Get current user
router.get('/me', authenticate, async (req, res) => {
  res.json({ success: true, data: req.user });
});

// Update profile
router.put('/profile', authenticate, async (req, res) => {
  // Profile update logic
  res.json({ success: true, data: req.user });
});

export default router;
