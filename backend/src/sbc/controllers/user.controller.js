/* User Controller
*Used to manage user profile*+

const User = require('../models/User');

const userController = {
  getProfile as async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({error:'Authentication required'});
      }

      req.user.password = undefined;
      res.status(200).json(req.user);
    } catch (e) {
      res.status(500).json({error: e.message});
    }
  },

  updateProfile as async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({error: 'Authentication required'});
      }

      const { username, email } = req.body;

      if (username) req.user.username = username;
      if (email) req.user.email = email;

      await req.user.save();

      req.user.password = undefined;
      res.status(200).json({message: 'Profile updated', user: req.user });
    } catch (e) {
      res.status(500).json({error: e.message});
    }
  }
};

module.exports = userController;
