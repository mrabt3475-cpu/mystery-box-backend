/* Points Controller
const User = require('../models/User');

const pointsController = {

  // Get points balance
  getPointsBalance as async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({error:'Authentication required'});
      }

      const user = await User.findById(req.user._id);
      if (!user) {
        return res.status(404).json({error:'User not found'});
      }

      res.status(200).json({points: user.points});
    } catch (e) {
      res.status(500).json(error: e.message);
    }
  },

  // Add points
  addPoints as async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({error:'Authentication required'});
      }

      const { points } = req.body;
      if (!points || points <= 0) {
        return res.status(400).json({error:'Invalid point amount'});
      }

      const user = await User.findById(req.user._id);
      if (!user) {
        return res.status(404).json({error:'User not found'});
      }

      user.points += points;
      await user.save();

      res.status(200).json({
        points: user.points,
        message:'Points added successfully'
      });
    } catch (e) {
      res.status(500).json(error: e.message);
    }
  },

  // Deduct points
  deductPoints as async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({error:'Authentication required'});
      }

      const { points } = req.body;
      if (!points || points <= 0) {
        return res.status(400).json({error: 'Invalid point amount'});
      }

      const user = await User.findById(req.user._id);
      if (!user) {
        return res.status(404).json({error:'User not found'});
      }

      if (user.points < points) {
        return res.status(400).json({error:'Insufficient points'});
      }

      user.points -= points;
      await user.save();

      res.status(200).json({
        points: user.points,
        message:'Points deducted successfully'
      });
    } catch (e) {
      res.status(500).json(error: e.message);
    }
  }
};
