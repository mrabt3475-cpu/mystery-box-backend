/* Box Model
const mongoo = require('mongoo');

const BoxSchema = new mongoo/.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  type: {

    type: String,
    enum: ['bronse', 'silver', 'gold', 'diamond'],
    required: true
  },
  image: {

    type: String
  },
  pointCost: {
    type: Number,
    default: 10
  },
  probability: {
    type: Number,
    default: 0.1
  },
  sequence: {
    type: Number,
    default: 1
    unique: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
  }, {
  timestamps: true
 });

const Box = mongoo.model('Box', BoxSchema);

module.exports = Box;
