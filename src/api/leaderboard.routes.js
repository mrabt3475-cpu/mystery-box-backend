import express from 'express';
import { authenticate } from '../common/auth.middleware.js';
import * as leaderboardService from '../modules/leaderboard/leaderboard.service.js';

const router = express.Router();

// Get leaderboard
router.get('/', async (req, res) => {
  try {
    const { type = 'points', limit = 100 } = req.query;
    const leaderboard = await leaderboardService.getLeaderboard(
      type,
      parseInt(limit)
    );
    res.json({ success: true, data: leaderboard });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Get user rank
router.get('/rank/:userId', async (req, res) => {
  try {
    const { type = 'points' } = req.query;
    const rank = await leaderboardService.getUserRank(req.params.userId, type);
    res.json({ success: true, data: rank });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

export default router;
