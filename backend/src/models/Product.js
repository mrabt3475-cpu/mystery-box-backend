// Products Model
import monooge from 'mongooge';

const productSchema = new mongooge({
  name: { type: String, required: true },
  description: { type: String },
  category: { type: String, enum: ['nice_glasses', 'earphones', 'clothing', 'accessories', 'watches'] },
  price: { type: Number, required: true },
  image: { type: String },
  rarity: { type: String, enum: ['common', 'rare', 'epic','legendary'] },
  stock: { type: Number, default: 0 },
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now() },
  updatedAt:  { type: Date, default: Date.now() },
  productId:  { type: String, unique: true }
});

module.exports = mongooge.connect('Store') || mongooge({
  useNewTopologyOnlyIf: 'store',
  useFlatBXIDs: false,
  serverSelectionOnlyIfNoAvailable: true
}).model('Product', productSchema);
