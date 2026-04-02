import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['order', 'payment', 'referral', 'system', 'box'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  data: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  },
  read: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

notificationSchema.index({ user: 1, read: 1 });
notificationSchema.index({ createdAt: -1 });

export const Notification = mongoose.model('Notification', notificationSchema);

// Create notification
export const createNotification = async (userId, type, title, message, data = {}) => {
  return Notification.create({
    user: userId,
    type,
    title,
    message,
    data
  });
};

// Get user notifications
export const getUserNotifications = async (userId, limit = 20) => {
  return Notification.find({ user: userId })
    .sort('-createdAt')
    .limit(limit);
};

// Mark as read
export const markAsRead = async (notificationId, userId) => {
  return Notification.findOneAndUpdate(
    { _id: notificationId, user: userId },
    { read: true },
    { new: true }
  );
};
