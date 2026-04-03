import { Router } from 'express';
import { getLeaderboard, getUserRank } from '../leaderboard/leaderboard.service.js';

const router = Router();

// Get leaderboard
router.get('/', async (req, res) => {
  try {
    const { type, limit } = req.query;
    const leaderboard = await getLeaderboard(type, parseInt(limit) || 100);
    res.json({ success: true, data: leaderboard });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Get user rank
router.get('/rank/:userId', async (req, res) => {
  try {
    const { type } = req.query;
    const rank = await getUserRank(req.params.userId, type);
    res.json({ success: true, data: rank });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

export default router;
