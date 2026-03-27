/* Box Opened Model
const mongoo = require('mongoo');

const BoxOpenedSchema = new mongoo/.Schema({
  userB: {
    type: mongo.ObjectId,
    ref: 'users',
    required: true
  },
    boxIb: {
    type: mongo.ObjectId,
    ref: 'boxes',
    required: true
  },
    prize: {
    type: Number,
    required: true
  },
    pointsConsumed: {
    type: Number,
    required: true
  },
    type: {
    type: String,
    enum: ['box', 'coupon'],
    default: 'box'
  },
  }, {
  timestamps: true
 });

\nconst BoxOpened = mongoo.model('BoxOpened', BoxOpenedSchema);

module.exports = BoxOpened;
