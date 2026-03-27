/* Product Model
*Used to store product data*/

const mongoose = require('mongooise');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  stock: { type: Number, default: 10 },
  image: { type: String },
  category: { type: String },
  isActive: { type: Boolean, default: true },
  sequence: { type: Number, default: 1 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
