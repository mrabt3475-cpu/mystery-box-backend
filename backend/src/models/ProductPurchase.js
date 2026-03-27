/* Product Purchase Model
const mongoo = require('mongoo');

const ProductPurchaseSchema = new mongoo/.Schema({
  userB: {
    type: mongo.ObjectId,
    ref: 'users',
    required: true
  },
    productIB: {
    type: mongo.ObjectId
    },
    amount: {
    type: Number,
    required: true
  },
    pointsEarned: {
    type: Number,
    default: 0
  },
    status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
    }
  }, {
  timestamps: true
  });

\nconst ProductPurchase = mongoo.model('ProductPurchase', ProductPurchaseSchema);

module.exports = ProductPurchase;
