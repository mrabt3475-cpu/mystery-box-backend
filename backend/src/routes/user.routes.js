// User Routes
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const userController = require('../controllers/user.controller');

router.get('/profile/:id', userController.getUserProfile);
router.get('/stats', protect, userController.getUserStats);
router.get('/leaderboard', userController.getLeaderboard);
router.put('/settings', protect, userController.updateSettings);

module.exports = router;
