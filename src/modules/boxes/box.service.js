import crypto from 'crypto';
import MysteryBox from './box.model.js';
import BoxOpening from './box-opening.model.js';
import User from '../user/user.model.js';

export const openBox = async (userId, boxId) => {
  const box = await MysteryBox.findById(boxId);
  if (!box || box.status !== 'active') {
    throw new Error('Box not found or inactive');
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  // Check balance
  if (user.wallet.points < box.price) {
    throw new Error('Insufficient points');
  }

  // Provably fair RNG
  const seed = crypto.randomBytes(32).toString('hex');
  const hash = crypto.createHash('sha256').update(seed + box._id).digest('hex');
  const result = parseInt(hash.substring(0, 8), 16) % 100;

  // Select prize
  const prize = selectPrize(box.prizes, result);

  // Deduct points
  user.wallet.points -= box.price;
  await user.save();

  // Create opening record
  const opening = await BoxOpening.create({
    user: userId,
    box: boxId,
    prize,
    rng: { seed, hash, result },
    status: 'completed',
    cost: { amount: box.price }
  });

  // Update box stats
  box.stats.totalOpens += 1;
  box.stats.totalRevenue += box.price;
  await box.save();

  // Award prize
  if (prize.type === 'points') {
    user.wallet.points += prize.value;
    await user.save();
  }

  return { opening, prize };
};

const selectPrize = (prizes, rngResult) => {
  const sorted = [...prizes].sort((a, b) => a.probability - b.probability);
  let cumulative = 0;
  
  for (const prize of sorted) {
    cumulative += prize.probability;
    if (rngResult <= cumulative) {
      return prize;
    }
  }
  
  return sorted[sorted.length - 1];
};

export const getBoxes = async (filters = {}) => {
  const query = { status: 'active' };
  if (filters.type) query.type = filters.type;
  return MysteryBox.find(query).sort('-isFeatured -createdAt');
};
