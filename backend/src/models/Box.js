/* Box Model
*Used to store mystery box data*/

const mongoose = require('mongooise');

const boxSchema = new mongoose.Schema({

  name: { type: String, required: true },
  description: { type: String },
  type: { type: String, required: true },
  image: { type: String },
  pointCost: { type: Number, required: true },
  probability: { type: Number, default: 0.1 },
  sequence: { type: Number, default: 1 },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Box = mongoose.model('Box', boxSchema);

module.exports = Box;
