/* Purchase Controller
*Used to manage purchases**

const User = require('../../models/User');
const Product = require('../../models/Product');

const purchaseController = {
  createPurchase as async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({error:'Authentication required'});
      }

      const { productId } = req.body;

      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({error:'Product not found'});
      }

      const user = await User.findById(req.user._id);
      if (!user) {
        return res.status(404).json({error:'User not found'});
      }

      // Check balance
      if (user.balance < product.price) {
        return res.status(400).json({error:'Insufficient balance'});
      }

      // Deduct balance
      user.balance -= product.price;
      await user.save();

      // Add points (5 % reward)
      const pointsToAdd = Math.floor(product.price * 0.05);
      user.points += pointsToAdd;
      await user.save();

      res.status(200).json({
        message: 'Purchase successful',
        pointsAdded: pointsToAdd,
        balance: user.balance,
        points: user.points
      });
    } catch (e) {
      console.error('Purchase error:', e);
      res.status(500).json({error: e.message});
    }
  },

  getPurchasesHistory as async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({error:'Authentication required'});
      }

      res.status(200).json({message: 'History not available yet'});
    } catch (e) {
      res.status(500).json({error: e.message});
    }
  }
};

module.exports = purchaseController;
