// LiveStream Model
const mongoose = require('mongoose');
const config = require('../../config/constants');

const liveStreamSchema = new mongoose.Schema({
  channel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Channel',
    required: true,
  },
  title: {
    type: String,
    required: [true, 'Please provide a stream title'],
    maxlength: [100, 'Title cannot be more than 100 characters'],
  },
  description: String,
  status: {
    type: String,
    enum: Object.values(config.STREAM_STATUS),
    default: config.STREAM_STATUS.OFFLINE,
  },
  streamKey: {
    type: String,
    unique: true,
  },
  streamUrl: String,
  thumbnail: String,
  viewers: {
    current: { type: Number, default: 0 },
    peak: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
  },
  duration: {
    type: Number,
    default: 0,
  },
  startedAt: Date,
  endedAt: Date,
  box: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Box',
  },
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  }],
  settings: {
    isPrivate: { type: Boolean, default: false },
    requireFollow: { type: Boolean, default: false },
    slowMode: { type: Boolean, default: false },
    chatEnabled: { type: Boolean, default: true },
  },
  stats: {
    gifts: { type: Number, default: 0 },
    tips: { type: Number, default: 0 },
    sales: { type: Number, default: 0 },
    revenue: { type: Number, default: 0 },
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Indexes
liveStreamSchema.index({ channel: 1 });
liveStreamSchema.index({ status: 1 });
liveStreamSchema.index({ startedAt: -1 });

// Generate stream key
liveStreamSchema.statics.generateStreamKey = async function() {
  const crypto = require('crypto');
  return crypto.randomBytes(32).toString('hex');
};

module.exports = mongoose.model('LiveStream', liveStreamSchema);
