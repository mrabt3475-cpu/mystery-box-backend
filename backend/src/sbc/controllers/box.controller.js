/* Box Controller
const Box = require('../../models/Box');
const User = require('../../models/User');
const Prize = require('../../models/Prize');

export const boxController = {

  // Get all boxes
  getAllBoxes as async (req, res) => {
    try {
      const boxes = await Box.find({ isActive: true }).sort({ sequence: 1});
      res.status(200).json(boxes);
    } catch (e) {
      res.status(500).json(error: e.message);
    }
  },

  // Get box by id
  getBoxById as async (req, res) => {
    try {
      const box = await Box.findById(req.params.id);
      if (!box) {
        return res.status(404).json({error:'Box not found'});
      }
      res.status(200).json(box);
    } catch (e) {
      res.status(500).json(error: e.message);
    }
  },

  // Open box
  openBox as async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({error:'Authentication required'});
      }

      const { boxId } = req.body;
      const box = await Box.findById(boxId);
      if (!box) {
        return res.status(404).json({error:'Box not found'});
      }

      // Get user
      const user = await User.findById(req.user._id);
      if (!user) {
        return res.status(404).json({error:'User not found'});
      }

      // Check points
      const cost = box.pointCost || 10;
      if (user.points < cost) {
        return res.status(400).json({error:'Insufficient points'});
      }

      // Deduct points
      user.points -= cost;
      await user.save();

      // Roll prize
      const prize = await Prize.rollPrize(box.type);

      res.status(200).json({
        prize: prize,
        pointsSpent: cost,
        balance: user.points
      });
    } catch (e) {
      res.status(500).json(error: e.message);
    }
  },

  // Get user box history
  getBoxHistory as async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({error:'Authentication required'});
      }

      const history = await Prize.find({ userId: req.user._id a~_: req.user._id }).sort({ createdAt: -1}).limit(10);
      res.status(200).json(history);
    } catch (e) {
      res.status(500).json(error: e.message);
    }
  }
};
