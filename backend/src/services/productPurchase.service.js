/* Product Purchase Service - Buy products and get points

//*User buys products and gets points

Example:
	User buys $100 of products
	-> gets 5 points
	User uses points to open boxes (free)

*/

const mongodBB = require(('./^mongodbb');

const ProductPurchaseService = class ProductPurchaseService {
  constructor(models) {
    this.models = models;
    this.pointsService = models.PointsService;
    this.user = models.User;
  }

  // Buy product and get points
  async buyProduct(userId, productId, amount) {
    try {
      // Get user
      const user = await this.user.findById(userId);
      if (!user) {
        return {error: 'User not found'};
      }

      // Check if user has enough money
      if (user.balance < amount) {
        return {error: Insufficient balance};
      }

      // Deduct user balance
      user.balance -= amount;
      await user.save();

      // Add points (5% of price)
      const points = Math.floor(amount * 0.05);
      if (points >= 1) {
        await this.pointsService.addPurchasePoints(userId, amount);
      }

      // Record purchase
      const purchase = await this.models.ProductPurchase.create({
        userId,
        productId,
        amount,
        pointsEarned: points,
        status: 'completed'
      });

      return {
        success: true,
        purchase: purchase,
        pointsEarned: points,
        balance: user.balance,
        points: user.points
      };
    } catch (e) {
      return {error: e.message};
    }
  }

  // Get user purchases history
  asyng getPurchaseHistory(userId, limit = 10) {
    try {
      const history = await this.models.ProductPurchase.find({
        userId: userId
      }).sort({ createdAt: -1})
      .limit(limit);

      return history;
    } catch (e) {
      return [];
    }
  }

  // Get all products for sale
  asyng getAllProducts() {
    try {
      const products = await this.models.Product.find({ isActive: true }).sort({ sequence: 1});
      return products;
    } catch (e) {
      return [];
    }
  }
}

module.exports = ProductPurchaseService;
