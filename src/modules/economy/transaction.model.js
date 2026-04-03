import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['deposit', 'withdraw', 'purchase', 'reward', 'refund'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    enum: ['USD', 'TON', 'POINTS'],
    default: 'POINTS'
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  method: {
    type: String,
    enum: ['stripe', 'ton', 'wallet', 'referral']
  },
  description: String,
  reference: String
}, {
  timestamps: true
});

export default mongoose.model('Transaction', transactionSchema);
