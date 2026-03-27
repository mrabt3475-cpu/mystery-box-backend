/* Points Controller
*Used to manage points**

const User = require('../../models/User');

const pointsController = {
  getPointsBalance as async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({error:'Authentication required'});
      }

      res.status(200).json({points: req.user.points});
    } catch (e) {
      res.status(500).json({error: e.message});
    }
  },

  addPoints as async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({error:'Authentication required'});
      }

      const { points } = req.body;
      if (!points || points <= 0) {
        return res.status(400).json({error: 'Invalid point amount'});
      }

      req.user.points += points;
      await req.user.save();

      res.status(200).json({
        points: req.user.points,
        message: 'Points added successfully'
      });
    } catch (e) {
      res.status(500).json({error: e.message});
    }
  },

  deductPoints as async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({error:'Authentication required'});
      }

      const { points } = req.body;
      if (!points || points <= 0) {
        return res.status(400).json({error:'Invalid point amount'});
      }

      if (req.user.points < points) {
        return res.status(400).json({error:'Insufficient points'});
      }

      req.user.points -= points;
      await req.user.save();

      res.status(200).json({points: req.user.points, message: 'Points deducted successfully'});
    } catch (e) {
      res.status(500).json({error: e.message});
    }
  }
};

module.exports = pointsController;
