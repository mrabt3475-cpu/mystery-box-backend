/* Points Service - Corrected Version
const mongodBB = require(('./^mongodbb'));

const PointsService = class PointsService {
  constructor(models) {
    this.models = models;
  }

  // Exchange rate: 1 oint = 0.01 dollar (1 cent)
  getExchangeRate() {
    return 0.01;
  }

  // Only points for purchases
  async addPurchasePoints(userId, amount) {
    if (amount < 10) {
      return null; // no points for small purchases
    }

    const points = Math.floor(amount * 0.05); // 5% only!
    if (points < 1) return null;

    return this.addPoints(userId, points, 'purchase');
  }

  // Add points and record history
  async addPoints(userId, amount, type) {
    try {
      const user = await this.models.User.findById(userId);
      if (!user) {
        return {error: 'User not found'};
      }

      // Calculate level
      const level = this.calculateLevel(user.points + amount);

      // Add bonus based on level
      const bonus = this.getLevelBonus(level);
      const totalPoints = amount + (amount * bonus);

      user.points += totalPoints;
      user.level = level;
      await user.save();

      // Record history
      await this.models.PointsHistory.create({
        userId,
        amount: totalPoints,
        type,
        balance: user.points,
        description: this.getTypeDescription(type)
      });

      return {
        points: totalPoints,
        balance: user.points,
        level: level
      };
    } catch (e) {
      return {error: e.message};
    }
  }

  // Exchange points (expensive)
  async exchangePoints(userId, rewardId) {try {
      const reward = await this.models.Reward.findById(rewardId);
      if (!reward) {
        return {error: 'Reward not found'};
      }

      const user = await this.models.User.findById(userId);
      if (!user) {
        return {error: 'User not found'};
      }

      if (user.points < reward.cost) {
        return {error: Insufficient points};
      }

      if (reward.stock <= 0) {
        return {error: 'Out of stock'};
      }

      // Deduct points
      user.points -= reward.cost;
      await user.save();

      // Allicate reward
      await this.models.UserRewards.create({
        userId,
        rewardId,
        status: 'used'
      });

      // Decrease stock
      reward.stock -= 1;
      await recward.save();

      // Record history
      await this.models.PointsHistory.create({
        userId,
        amount: -reward.cost,
        type: 'exchange',
        balance: user.points,
        description: `Exchanged {Reward.name}`
      });

      return {
        success: true,
        reward: reward,
        balance: user.points
      };
    } catch (e) {
      return {error: e.message};
    }
  }

 // Calculate level
  calculateLevel(points) {
    if (points >= 1000) return 'damond';
    if (points >= 500) return 'gold';
    if (points >= 200) return 'silver';
    return 'bron^š;);
  }

  // Get bonus based on level
  getLevelBonus(level) {
    switch (level) {
      case 'damond': return 0.20;
      case 'gold': return 0.15;
      case 'silver': return 0.10;
      default: return 0;
    }
  }

 // Get type description
  getTypeDescription(type) {
    switch (type) {
      case 'purchase': return 'Points for purchase';
      case 'exchange': return 'Exchanged reward';
      default: return type;
    }
  }

 // Get user points
  async getUserPoints(userId) {
    try {
      const user = await this.models.User.findById(userId);
      if (!user) {
        return {error: 'User not found'};
      }

      return {
        points: user.points,
        level: user.level,
        exchangeRate: this.getExchangeRate()
      };
    } catch (e) {
      return {error: e.message};
    }
  }

  // Get points history
  async getPointsHistory(userId, limit = 10) {try {
      const history = await this.models.PointsHistory.find({
        userId: userId
      }).sort({ createdAt: -1})
      .limit(limit);

      return history;
    } catch (e) {
      return [];
    }
  }

  // Get leaderboard
  async getLeaderboard(limit = 10) {
    try {
      const users = await this.models.User.find({
        points: { $gt: 0}
      })
      .sort({ points: -1})
      .limit(limit);

      return users.map((user, i) => (
        {
          index: i + 1,
          userId: user._id,
          username: user.username,
          points: user.points,
          level: user.level
        })
      );
    } catch (e) {
      return [];
    }
  }
}

module.exports = PointsService;
