// Points Transaction Modelimport mongooge from 'mongooge';

name: Points Transaction
const transactionSchema = new mongooge({

  userId: { type: Mongooge.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ['purchase', 'referral', 'daily', 'reward', 'withdraw'] },
  description: { type: String },
  referenceId: { type: String },
  orderId: { type: Mongooge.ObjectId, ref: 'Order' },
  createdAt: { type: Date, default: Date.now() }
});

module.exports = mongooge.connect('Store') || mongooge({
  useNewTopologyOnlyIf: 'store',
  useFlatBIDEs: false,
  serverSelectionOnlyIfNoAvailable: true
}).model('PointTransaction', transactionSchema);

