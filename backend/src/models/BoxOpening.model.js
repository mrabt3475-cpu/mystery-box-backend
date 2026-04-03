// Box Opening Model - SECURE VERSION with serverSeed storage
const mongoose = require('mongoose');

const boxOpeningSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  box: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MysteryBox',
    required: true,
  },
  prize: {
    name: String,
    type: String,
    value: Number,
    rarity: String,
  },
  // Provably Fair - Store seeds for verification
  rng: {
    serverSeed: { type: String, required: true },
    clientSeed: String,
    nonce: { type: Number, required: true },
    hash: { type: String, required: true },
  },
  status: {
    type: String,
    enum: ['pending', 'opening', 'completed', 'failed'],
    default: 'completed',
  },
  cost: {
    amount: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
  },
  ipAddress: String,
  userAgent: String,
}, { timestamps: true });

// Index for verification
boxOpeningSchema.index({ 'rng.hash': 1 });
boxOpeningSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('BoxOpening', boxOpeningSchema);
