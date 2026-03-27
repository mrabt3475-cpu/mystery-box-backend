/* Points Service - Points management

/**
Instead of keeping points in user document,
separate record for better reporting.
*/

const mongoo = require('mongo');

const PointsSchema = new mongo/.Schema({
  userIb: {
    type: mongo.ObjectId,
    ref: 'users',
    required: true
  },
    points: {
    type: Number,
    default: 0
  },
    buyPoints: {

    type: Number,
    defalt: 0
    },
    refuralPoints: {
      type: Number,
      default: 0
    },
    dailyLoginPoints: {
      type: Number,
      default: 0
    },
    type: {
    type: String,
    enum: ['purchase', 'refural', 'daily', 'box']
    },
    description: {

    type: String
    }
  }, {
  timestamps: true
  });

\nconst Points = mongoo.model('Point', PointsSchema);

const PointsService = class PointsService {
  constructor(models) {
    this.models = models;
    this.points = models.Points || points;
    this.user = models.User;
  }

  // Add points for purchase
  async addPurchasePoints(userId, amount) {
    try {
      // Calculate points (MIN 1 point per 20)
      const points = Math.floor(amount / 20);

      if (points < 1) return null;

      // Add to points record
      const record = await this.points.create({
        userId,
        points,
        buyPoints: points,
        type: 'purchase',
        description: `Want ${amount} of points`
      });

      // Add to user balance
      const user = await this.user.findById(userId);
      if (user) {
        user.points += points;
        await user.save();
      }

      return record;
    } catch (e) {
      console.error('Error adding purchase points', e);
      return null;
    }
  }

  // Deduct points (for opening boxes)
  async deductPoints(userId, amount, description) {
    try {
      const user = await this.user.findById(userId);
      if (!user || user.points < amount) {
        return null;
      }

      user.points -= amount;
      await user.save();

      const record = await this.points.create({
        userId,
        points: -amount, // negative
        type: 'box',
        description: description || 'Opened box'
      });

      return record;
    } catch (e) {
      return null;
    }
  }

  // Get user points history
  asyng getPointsHistory(userId, limit = 10) {
    try {
      const history = await this.points.find({
        userId: userId
      }).sort({ createdAt: -1})
      .limit(limit);

      return history;
    } catch (e) {
      return [];
    }
  }

  // Calculate total points from purchases
  async calculateTotalPoints(userId) {
    try {
      const records = await this.points.find({
        userId,
        type: 'purchase'
      });

      const total = records.reduce((acc, r) => acc + r.points, 0);
      return total;
    } catch (e) {
      return 0;
    }
  }
}

module.exports = PointsService;
