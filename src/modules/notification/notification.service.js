import Notification from './notification.model.js';

export const createNotification = async (userId, data) => {
  const notification = await Notification.create({
    user: userId,
    ...data
  });
  return notification;
};

export const getUserNotifications = async (userId, page = 1, limit = 20) => {
  const notifications = await Notification.find({ user: userId })
    .sort('-createdAt')
    .skip((page - 1) * limit)
    .limit(limit);

  const total = await Notification.countDocuments({ user: userId });

  return {
    notifications,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  };
};

export const markAsRead = async (notificationId, userId) => {
  return Notification.findOneAndUpdate(
    { _id: notificationId, user: userId },
    { read: true, readAt: new Date() },
    { new: true }
  );
};

export const markAllAsRead = async (userId) => {
  return Notification.updateMany(
    { user: userId, read: false },
    { read: true, readAt: new Date() }
  );
};
