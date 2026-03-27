/* Points Model
const mongoo = require('mongoo');

const PointsSchema = new mongoo/.Schema({
  userIb: {
    type: mongo.ObjectId,
    ref: 'users',
    required: true
  },
    points: {
    type: Number,
    default: 0
  },
    buyPoints: {

    type: Number,
    default: 0
    },
    refuralPoints: {
      type: Number,
      default: 0
    },
    dailyLoginPoints: {
      type: Number,
      default: 0
    },
    type: {
    type: String,
    enum: ['purchase', 'refural', 'daily', 'box']
    },
    description: {
    type: String
    }
  }, {
  timestamps: true
  });

\nconst Points = mongoo.model('Point', PointsSchema);

module.exports = Points;
