import jwt from 'jsonwebtoken';
import User from './user.model.js';

export const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

export const register = async (data) => {
  const { name, email, password, referralCode } = data;

  // Check if user exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('Email already registered');
  }

  // Check referral
  let referredBy = null;
  if (referralCode) {
    referredBy = await User.findOne({ referralCode });
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    referredBy
  });

  // Generate token
  const token = generateToken(user._id);

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      wallet: user.wallet
    },
    token
  };
};

export const login = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  if (user.status !== 'active') {
    throw new Error('Account is not active');
  }

  // Update last active
  user.stats.lastActiveAt = new Date();
  await user.save();

  const token = generateToken(user._id);

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      wallet: user.wallet
    },
    token
  };
};
