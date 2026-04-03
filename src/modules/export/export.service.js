import User from '../modules/user/user.user.model.js';
import Order from '../modules/orders/order.model.js';
import BoxOpening from '../modules/boxes/box-opening.model.js';
import fs from 'fs';
import path from 'path';

export const exportUsers = async (format = 'csv') => {
  const users = await User.find().select('-password').lean();

  if (format === 'csv') {
    const headers = 'Name,Email,Role,Wallet Balance,Points,Created At\n';
    const rows = users.map(u => 
      `${u.name},${u.email},${u.role},${u.wallet?.balance || 0},${u.wallet?.points || 0},${u.createdAt}`
    ).join('\n');
    return headers + rows;
  }

  return JSON.stringify(users, null, 2);
};

export const exportOrders = async (format = 'csv') => {
  const orders = await Order.find()
    .populate('user', 'name email')
    .lean();

  if (format === 'csv') {
    const headers = 'Order Number,User,Total,Status,Payment Status,Created At\n';
    const rows = orders.map(o => 
      `${o.orderNumber},${o.user?.name},${o.total},${o.status},${o.paymentStatus},${o.createdAt}`
    ).join('\n');
    return headers + rows;
  }

  return JSON.stringify(orders, null, 2);
};

export const exportBoxes = async (format = 'csv') => {
  const openings = await BoxOpening.find()
    .populate('user', 'name')
    .populate('box', 'name')
    .lean();

  if (format === 'csv') {
    const headers = 'User,Box,Prize,Rarity,Cost,Date\n';
    const rows = openings.map(o => 
      `${o.user?.name},${o.box?.name},${o.prize?.name},${o.prize?.rarity},${o.cost?.amount},${o.createdAt}`
    ).join('\n');
    return headers + rows;
  }

  return JSON.stringify(openings, null, 2);
};
