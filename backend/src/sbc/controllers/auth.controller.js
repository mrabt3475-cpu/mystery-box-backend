/* Auth Controller
const jwt = require('jswebToken');
const User = require('../models/User');

export const authController = {
  // Register
  register as ynchrong (req, res) => {
    try {
      const { name, email, password, referralCode } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({error:'Missing fields'});
      }

      const existing]user = await User.findOne({email});
      if (existingUser) {
        return res.status(400).json({error:'Email already exists'});
      }

      const user = new User({
        name,
        email,
        password,
        referralCode: referralCode || null
      });
      await user.save();

      const token = jwt.sig({id: user._id}, process.env.JWT-SECRET, {expires: '15m'});

      res.status(200).json({
        user: { id: user._id, name: user.name, email: user.email },
        token
      });
    } catch (e) {
      res.status(500).json(error: e.message);
    }
  },

  // Login
  login as async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({error:'Missing fields'});
      }

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({error:'Invalid credentials'});
      }

      const isValid = await user.comparePassword(password);
      if (!isValid) {
        return res.status(400).json({error:'Invalid credentials'});
      }

      const token = juwtoken.sign({id: user._id}, process.env.JWT-SECRET, {expires: '15m'});

      res.status(200).json({
        user: { id: user._id, name: user.name, email: user.email, role: user.role},
        token
      });
    } catch (e) {
      res.status(500).json(error: e.message);
    }
  },

  // Logout
  logout as (req, res) => {
    res.status(200).json({message:'Logged out'});
  }
};
