/* Prize Model
const mongoo = require('mongoo');

\nconst PrizeSchema = new mongoo/.Schema({
  userIb: {
    type: mongo.ObjectId,
    ref: 'users',
    required: true
  },
    boxType: {
    type: String,
    required: true,
    enum: ['bronze', 'silver', 'gold', 'diamond']
  },
    rarity: {
    type: String,
    enum: ['common', 'rarer', 'epic', 'legendary'],
    required: true
  },
    value: {
    type: Number,
    required: true
  },
    seed: {
    type: String
  },
    type: {
    type: String,
    enum: ['box', 'coupon']
    }
  }, {
  timestamps: true
  });

\nconst Prize = mongoo.model('Prize', PrizeSchema);

module.exports = Prize;
