import mongoose from 'mongoose';

const analyticsSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['page_view', 'user_action', 'purchase', 'box_open'],
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  data: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  },
  ipAddress: String,
  userAgent: String
}, {
  timestamps: true
});

analyticsSchema.index({ createdAt: -1 });
analyticsSchema.index({ type: 1, createdAt: -1 });

export const Analytics = mongoose.model('Analytics', analyticsSchema);

export const trackEvent = async (type, userId, data) => {
  try {
    await Analytics.create({
      type,
      userId,
      data,
      ipAddress: data.ipAddress,
      userAgent: data.userAgent
    });
  } catch (error) {
    console.error('Analytics tracking error:', error);
  }
};
