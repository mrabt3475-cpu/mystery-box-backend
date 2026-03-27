/* Product Model
const mongoo = require('mongoo');

const ProductSchema = new mongo/.Schema({
  name: {

    type: String,
    required: true
  },
  description: {

    type: String
  },
  price: {
    type: Number,
    required: true
  },
  image: {

    type: String
  },
  category: {
    type: String
  },
  stock: {
    type: Number,
    default: 0
    },
  isActive: {
    type: Boolean,
    default: true
  },
  sequence: {

    type: Number,
    default: 0
    },
  productType: {
    type: String,
    enum: ['ship', 'phone', 'laptop', 'watch', 'gaming']
    },
  details: {

    type: Object
  }
  }, {
  timestamps: true
  });

const Product = mongoo.model('Product', ProductSchema);

module.exports = Product;
