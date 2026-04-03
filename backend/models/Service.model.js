const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  serviceType: {
    type: String,
    enum: ['group', 'channel', 'bot'],
    required: true
  },
  members: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    role: { type: String, enum: ['owner', 'admin', 'moderator', 'member'], default: 'member' },
    joinedAt: { type: Date, default: Date.now }
  }],
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  cost: {
    type: Number,
    default: 0
  },
  pointsRequired: {
    type: Number,
    default: 0
  },
  joinMode: {
    type: String,
    enum: ['free', 'points', 'invite'],
    default: 'free'
  },
  inviteLink: {
    type: String,
    default: ''
  },
  settings: {
    allowChat: { type: Boolean, default: true },
    allowGifts: { type: Boolean, default: true },
    slowMode: { type: Boolean, default: false },
    color: { type: String, default: '#6366f1' }
  },
  stats: {
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 }
  },
  posts: [{
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    content: String,
    createdAt: { type: Date, default: Date.now }
  }],
  expiresAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

serviceSchema.index({ owner: 1 });
serviceSchema.index({ serviceType: 1, status: 1 });

module.exports = mongoose.model('Service', serviceSchema);
