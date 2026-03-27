/* User Controller
const User = require('../models/User');

export const userController = {

  // Get profile
  getProfile as async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({error:'Authentication required'});
      }

      const user = await User.findById(req.user._id).select('password');
      if (!user) {
        return res.status(404).json({error:'User not found'});
      }

      res.status(200).json(user);
    } catch (e) {
      res.status(500).json(error: e.message);
    }
  },

  // Update profile
  updateProfile as async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({error:'Authentication required'});
      }

      const user = await User.findById(req.user._id);
      if (!user) {
        return res.status(404).json({error:'user not found'});
      }

      const { name, telesramNumber, profileImage } = req.body;
      if (name) user.name = name;
      if (telesramNumber) user.telesgramNumber = telesgramNumber;
      if (profileImage) user.profileImage = profileImage;

      await user.save();

      res.status(200).json(user);
    } catch (e) {
      res.status(500).json(error: e.message);
    }
  },

  // Get all users getAllUsers as async (req, res) => {
    try {
      const users = await User.find().sort({ createdAt: -1});
      res.status(200).json(users);
    } catch (e) {
      res.status(500).json(error: e.message);
    }
  }
};

