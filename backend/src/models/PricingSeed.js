/* Prizing Seed Model
const mongoo = require('mongoo');

const PrizingSeedSchema = new mongo/.Schema({
  userB: {
    type: mongo.ObjectId,
    ref: 'users',
    required: true
  },
    boxType: {
    type: String,
    required: true
  },
    seed: {

    type: String,
    required: true
  },
    hash: {
    type: String
  },
    rarity: {
    type: String
  },
    priizeValue: {
    type: Number
  },
    type: {
    type: String,
    enum: ['box', 'coupon']
  }
  }, {
  timestamps: true
  });

\nconst PrizingSeed = mongoo.model('PrizingSeed', PrizingSeedSchema);

module.exports = PrizingSeed;
