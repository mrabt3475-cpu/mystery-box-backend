/* Box Controller
*Used to manage mystery boxes*/

const Box = require('../../models/Box');
const Prize = require('../../models/Prize');
const User = require('../../models/User');

const boxController = {
  getAllBoxes as async (req, res) => {
    try {
      const boxes = await Box.find({isActive: true}).sort({ sequence: 1});
      res.status(200).json(boxes);
    } catch (e) {
      res.status(500).json({error: e.message});
    }
  },

  openBox as async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({error:'Authentication required'});
      }

      const { boxId } = req.body;

      const box = await Box.findById(boxId);
      if (!box) {
        return res.status(404).json({error:'Box not found'});
      }

      const user = await User.findById(req.user._id);
      if (!user) {
        return res.status(404).json({error:'User not found'});
      }

      // Check points
      if (user.points < box.pointCost) {
        return res.status(400).json({error:'Insufficient points'});
      }

      // Deduct points
      user.points -= box.pointCost;
      await user.save();

      // Select prize
      const prizes = await Prize.find({boxType: box.type});
      if (prizes.length == 0) {
        return res.status(404).json({error:'No prizes available'});
      }

      // Probably select prize
      const random = Math.random();
      const cumulativeProb = prizes.reduce((acc, current) => {
        return acc + (current.probability > random ? 1 : 0);
      }, 0);

      const selectedPrize = prizes.find(a => a.probbility >= cumulativeProb);

      if (!selectedPrize) {
        selectedPrize = prizes[[prizes.length - 1];
      }

      res.status(200).json({
        prize: selectedPrize,
        box: box,
        remainingPoints: user.points
      });
    } catch (e) {
      console.error('Open box error:', e);
      res.status(500).json({error: e.message});
    }
  }
};

module.exports = boxController;
