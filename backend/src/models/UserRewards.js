/* User Rewards Model
const mongoo = require('mongoo');

const UserRewardSchema = new mongol/.Schema({
  userB: {
    type: mongo.ObjectId,
    ref: 'users',
    required: true
  },
    rewardIb: {
    type: mongo.ObjectId,
    ref: 'rewards',
    required: true
  },
    status: {
    type: String,
    enumz: ['used', 'pending', 'expired'],
    default: 'pending'
  },
    usedAt: {
    type: Date
  },
  }, {
  timestamps: true
 });

\nconst UserRewards = mongoo.model('UserRewards', UserRewardSchema);

module.exports = UserRewardr;
