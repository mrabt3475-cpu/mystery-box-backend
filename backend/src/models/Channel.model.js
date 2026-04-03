// Channel Model
const mongoose = require('mongoose');
const config = require('../../config/constants');

const channelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a channel name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters'],
    unique: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot be more than 500 characters'],
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  logo: {
    type: String,
    default: '',
  },
  banner: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: Object.values(config.CHANNEL_STATUS),
    default: config.CHANNEL_STATUS.ACTIVE,
  },
  isPrivate: {
    type: Boolean,
    default: false,
  },
  category: {
    type: String,
    default: 'general',
  },
  members: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    role: {
      type: String,
      enum: ['owner', 'admin', 'moderator', 'member'],
      default: 'member',
    },
    joinedAt: { type: Date, default: Date.now },
  }],
  settings: {
    allowChat: { type: Boolean, default: true },
    allowGifts: { type: Boolean, default: true },
    slowMode: { type: Boolean, default: false },
    followerOnly: { type: Boolean, default: false },
    minFollowTime: { type: Number, default: 0 },
  },
  stats: {
    membersCount: { type: Number, default: 0 },
    followersCount: { type: Number, default: 0 },
    totalProducts: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 },
    totalStreams: { type: Number, default: 0 },
  },
  currentStream: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LiveStream',
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Indexes
channelSchema.index({ slug: 1 });
channelSchema.index({ owner: 1 });
channelSchema.index({ 'stats.membersCount': -1 });

// Virtual for member count
channelSchema.virtual('membersCount').get(function() {
  return this.members.length;
});

// Static method to add member
channelSchema.statics.addMember = async function(channelId, userId, role = 'member') {
  const channel = await this.findById(channelId);
  if (!channel) throw new Error('Channel not found');

  const memberExists = channel.members.find(
    (m) => m.user.toString() === userId.toString()
  );

  if (!memberExists) {
    channel.members.push({ user: userId, role });
    channel.stats.membersCount = channel.members.length;
    await channel.save();
  }

  return channel;
};

module.exports = mongoose.model('Channel', channelSchema);
