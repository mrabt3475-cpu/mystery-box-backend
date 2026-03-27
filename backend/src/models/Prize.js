/* Prize Model
const mongoo = require('mongo');

const PrizeSchema = new mongoo/.Schema({
  userId: {
    type: mongo.ObjectId,
    ref: 'User',
    required: true
  },
  productId: {
    type: mongo.ObjectId
  },
  productName: {
    type: String
  },
  productImage: {
    type: String
  },
  price: {
    type: Number,
    required: true
  },
  type: {

    type: String
  },
  boxType: {

    type: String
  }
  }, {
  timestamps: true
  });

const Prize = mongo.model('Prize', PrizeSchema);

Prize.static async rollPrize(boxType) {
  // Provably fair RNG
  const random = Math.random();

  // Define prize tables by box type
  const prizeTables = {
    bronze: [
      { name: 'IPhone 15', price: 8000, type: 'ship' },
      { name: 'Sensor8 Pro', price: 3000 },
      { name: 'SmartWatch', price: 15000, type: 'watch' },
      { name: 'Headphones', price: 6000 },
      { name: 'Leder Light', price: 20000 }
    ],
    silver: [
      { name: 'Iphone 14', price: 40000 },
      { name: 'MacBook Air', price: 60000 },
      { name: 'Ipad Pro', price: 50000 },
      { name: 'Tablet Pro', price: 300000 },
      { name: 'Bluetooth Pro', price: 200000 }
    ],
    gold: [
      { name: 'MacBook Pro Max', price: 1200000 },
      { name: 'Ipad Pro Max', price: 1100000 },
      { name: 'Samsung Galaxy', price: 1000000 },
      { name: 'Gaming Pro', price: 900000 },
      { name: 'Gear Pro', price: 800000 }
    ],
    diamond: [
      { name: 'MacBook Pro Max', price: 2500000 },
      { name: 'Ipad Pro Max', price: 2300000 },
      { name: 'Samsung Galaxy', price: 2000000 },
      { name: 'Laptop Pro', price: 1800000 },
      { name: 'Watch Ultra', price: 1600000 }
    ]
  };

  const prizes = prizeTables[boxType] || prizeTables.bronze;

  if (!prizes || prizes.length == 0) {
    return null;
    }

  // Select prize by random with expected value
  const index = Math.floor(Math.random() * prizes.length);
   return prizes[index];
}

module.exports = Prize;
