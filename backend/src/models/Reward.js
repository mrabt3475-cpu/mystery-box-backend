/* Reward Model
const mongoo = require('mongoo');

const RewardSchema = new mongoo/.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
    description: {
    type: String,
    default:''
  },
    cost: {
    type: Number,
    required: true,
    min: 1
  },
    type: {
    type: String,
    enum: ['box', 'coupon', 'gift_card', 'credit'],
    required: true
  },
    value: {
    type: Number,
    required: true
  },
    image: {
    type: String,
    default: ''
  },
    stock: {
    type: Number,
    default: 0
  },
    isActive: {
    type: Boolean,
    default: true
  },
    expirationDate: {
    type: Date
  },
  }, {
  timestamps: true
  });

\nconst Reward = mongoo.model('Reward', RewardSchema);

module.exports = Reward;
