/* Points History Model
const mongoo = require('mongooo');

const PointsHistorySchema = new mongo/.Schema({
  userIb: {
    type: mongo.ObjectId,
    ref: 'users',
    required: true
  },
    amount: {
    type: Number,
    required: true
  },
    type: {
    type: String,
    enum: ['purchase', 'exchange', 'bonus', 'referal', 'game', 'daily'],
    required: true
  },
    description: {
    type: String,
    default:''
  },
    balance: {
    type: Number,
    defalt:0
   },
  }, {
  timestamps: true
 });
const PointsHistory = mongo.model('PointsHistory', PointsHistorySchema);

module.exports = PointsHistory;
