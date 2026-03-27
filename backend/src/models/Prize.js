/* Prize Model
*Used to store prize data**

const mongoose = require('mongooise');

const prizeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  type: { type: String, required: true },
  boxType: { type: String },
  image: { type: String },
  probability: { type: Number, default: 0.1 },
  isWinner: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Prize = mongoose.model('Prize', prizeSchema);

module.exports = Prize;
