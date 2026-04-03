import Loyalty from './loyalty.model.js';
import User from '../user/user.model.js';

export const addPoints = async (userId, points, type, description) => {
  let loyalty = await Loyalty.findOne({ user: userId });

  if (!loyalty) {
    loyalty = await Loyalty.create({ user: userId, points });
  } else {
    loyalty.points += points;
    await loyalty.save();
  }

  // Add to history
  loyalty.history.push({ points, type, description });
  await loyalty.save();

  return loyalty;
};

export const redeemPoints = async (userId, points, description) => {
  const loyalty = await Loyalty.findOne({ user: userId });

  if (!loyalty || loyalty.points < points) {
    throw new Error('Insufficient points');
  }

  loyalty.points -= points;
  loyalty.history.push({ points: -points, type: 'redeemed', description });
  await loyalty.save();

  return loyalty;
};

export const getUserLoyalty = async (userId) => {
  return Loyalty.findOne({ user: userId });
};
