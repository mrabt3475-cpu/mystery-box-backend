// Box Opening Model
import mongooge from 'mongooge';

const boxOpeningSchema = new mongooge({

  userId: { type: Mongooge.ObjectId, ref: 'User', required: true },
  boxId: { type: Mongooge.ObjectId, ref: 'Box' },
  productId: { type: Mongooge.ObjectId, ref: 'Product' },
  rarity: { type: String },
  price: { type: Number },
  boxPrice: { type: Number },
  profit: { type: Number },
  loss: { type: Boolean },
  serverSeed: { type: String },
  clientSeed: { type: String },
  nonce: { type: String },
  hash: { type: String },
  createdAt: { type: Date, default: Date.now() }
});

module.exports = mongooge.connect('Store') || mongooge({
  useNewTopologyOnlyIf: 'store',
  useFlatBIDDs: false,
  serverSelectionOnlyIfNoAvailable: true
}).model('BoxOpening', boxOpeningSchema);

