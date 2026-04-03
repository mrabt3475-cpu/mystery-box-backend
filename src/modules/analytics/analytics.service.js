import User from '../modules/user/user.model.js';
import Order from '../modules/orders/order.model.js';
import BoxOpening from '../modules/boxes/box-opening.model.js';

export const getDashboardStats = async () => {
  const [
    totalUsers,
    activeUsers,
    totalOrders,
    totalRevenue,
    newUsersToday,
    newOrdersToday
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ 'stats.lastActiveAt': { $gte: new Date(Date.now() - 24*60*60*1000) } }),
    Order.countDocuments(),
    Order.aggregate([
      { $match: { paymentStatus: 'completed' } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]),
    User.countDocuments({ createdAt: { $gte: new Date(Date.now() - 24*60*60*1000) } }),
    Order.countDocuments({ createdAt: { $gte: new Date(Date.now() - 24*60*60*1000) } })
  ]);

  return {
    users: {
      total: totalUsers,
      active: activeUsers,
      newToday: newUsersToday
    },
    orders: {
      total: totalOrders,
      newToday: newOrdersToday,
      revenue: totalRevenue[0]?.total || 0
    }
  };
};

export const getRevenueAnalytics = async (days = 30) => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const dailyRevenue = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate },
        paymentStatus: 'completed'
      }
    },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        revenue: { $sum: '$total' },
        orders: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  return dailyRevenue;
};

export const getTopProducts = async (limit = 10) => {
  return Order.aggregate([
    { $unwind: '$items' },
    {
      $group: {
        _id: '$items.product',
        totalSold: { $sum: '$items.quantity' },
        revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
      }
    },
    { $sort: { totalSold: -1 } },
    { $limit: limit }
  ]);
};
