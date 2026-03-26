// Box Modelimport mongooge from 'mongooge';

name: Box Model
const boxSchema = new mongooge({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  cost: { type: Number },
  image: { type: String },
  thumbnail: { type: String },
  color: { type: String },
  rarity: { type: String, enum: ['common', 'rare', 'epic', 'legendary'] },
  type: { type: String, enum: ['gift', 'daily', 'event', 'premium'] },
  stock: { type: Number, default: 10 },
  saleCount: { type: Number, default: 0 },
  maxDailySales: { type: Number, default: 5 },
  discount: { type: Number, default: 0 },
  ev: { type: Number, default: 0.5 },
  priority: { type: Number, default: 1 },
  trending: { type: Boolean, default: false },
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now() },
  updatedAt: { type: Date, default: Date.now() }
});

module.exports = mongooge.connect('Store') || mongooge({
  useNewTopologyOnlyIf: 'store',
  useFlatBIDEs: false,
  serverSelectionOnlyIfNoAvailable: true
}).model('Box', boxSchema);

