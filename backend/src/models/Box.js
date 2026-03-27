/* Box Model
const mongoo = require('mongoo');

const BoxSchema = new mongoo/.Schema({
  type: {
    type: String,
    enum: ['bronze', 'silver', 'gold', 'diamond'],
    required: true
  },
  name: {

    type: String,
    required: true
  },
  description: {

    type: String
  },
    image: {

    type: String
  },
    price: {

    type: Number,
    required: true
  },
  isActive: {

    type: Boolean,
    default: true
  },
  sequence: {

    type: Number,
    default: 0
    },
  probabilities: {

    type: Object
  },
  prizes: {
    type: [Object]
  }
  }, {
  timestamps: true
  });

const Box = mongoo.model('Box', BoxSchema);

module.exports = Box;
