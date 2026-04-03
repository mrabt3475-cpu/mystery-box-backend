import mongoose from 'mongoose';

const boxOpeningSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  box: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MysteryBox',
    required: true
  },
  prize: {
    name: String,
    type: String,
    value: Number,
    rarity: String
  },
  rng: {
    seed: String,
    hash: String,
    result: Number
  },
  status: {
    type: String,
    enum: ['pending', 'opening', 'completed', 'failed'],
    default: 'pending'
  },
  cost: {
    amount: Number,
    currency: { type: String, default: 'points' }
  }
}, {
  timestamps: true
});

export default mongoose.model('BoxOpening', boxOpeningSchema);
