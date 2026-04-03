import User from '../modules/user/user.model.js';
import BoxOpening from '../modules/boxes/box-opening.model.js';
import Order from '../modules/orders/order.model.js';

export const getLeaderboard = async (type = 'points', limit = 100) => {
  let leaderboard;

  switch (type) {
    case 'points':
      leaderboard = await User.find()
        .select('name avatar wallet.points stats.boxesOpened')
        .sort('-wallet.points')
        .limit(limit);
      break;

    case 'spending':
      leaderboard = await User.find()
        .select('name avatar stats.totalSpent')
        .sort('-stats.totalSpent')
        .limit(limit);
      break;

    case 'boxes':
      leaderboard = await User.find()
        .select('name avatar stats.boxesOpened')
        .sort('-stats.boxesOpened')
        .limit(limit);
      break;

    default:
      leaderboard = await User.find()
        .select('name avatar wallet.points')
        .sort('-wallet.points')
        .limit(limit);
  }

  // Add rank
  return leaderboard.map((user, index) => ({
    rank: index + 1,
    ...user.toObject()
  }));
};

export const getUserRank = async (userId, type = 'points') => {
  const allUsers = await User.find()
    .select('name wallet.points stats.totalSpent stats.boxesOpened')
    .sort(type === 'points' ? '-wallet.points' : '-stats.totalSpent');

  const rank = allUsers.findIndex(u => u._id.toString() === userId) + 1;
  return {
    rank,
    totalUsers: allUsers.length
  };
};
