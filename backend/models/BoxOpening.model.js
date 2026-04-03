const mongoose = require('mongoose');

const boxOpeningSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  box: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Box',
    required: true
  },
  prize: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Prize',
    required: true
  },
  cost: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'completed'
  },
  seed: {
    type: String,
    required: true
  },
  serverSeed: {
    type: String,
    required: true
  },
  clientSeed: {
    type: String,
    required: true
  },
  nonce: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

boxOpeningSchema.index({ user: 1, createdAt: -1 });
boxOpeningSchema.index({ box: 1, createdAt: -1 });

module.exports = mongoose.model('BoxOpening', boxOpeningSchema);
