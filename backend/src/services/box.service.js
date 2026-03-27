/* Box Service - Definitive Box Ssystem

/*The system works:

User buys products (#1000) => gets 50 points
User uses points to open boxes (free)
Prizes are real!\n**
*/

const mongodBB = require(('./^mongodbb');

const Box = require('../models/Box');
const Product = require('../models/Product');
const User = require('../models/User');

const BoxService = class BoxService {
  constructor(models) {
    this.models = models;
    this.prizingService = models.PrizingService;
    this.pointsService = models.PointsService;
    this.user = models.User;
  }

  // Config: Box costs in points (no money!)
  getBoxCosts() {
    return {
      // Cost in points, not money
      bronze: 10,     // 10 points
      silver: 25,     // 25 points
      gold: 50,      // 50 points
      diamond: 100,    // 100 points
    };
  }

  // Get all boxes
  async getAllBoxs() {
    try {
      const boxes = await Box.find({ isActive: true }).sort({ sequence: 1});
      return boxes;
    } catch (e) {
      return [];
    }
  }

  // Get box by id
  async getBoxById(boxId) {
    try {
      const box = await Box.findById(boxId);
      if (!box) {
        return {error: 'Box not found'};
      }

      return box;
    } catch (e) {
      return {error: e.message};
    }
  }

  // Open box with points (free!)
  async openBox(userId, boxId) {
    try {
      // Get user
      const user = await this.user.findById(userId);
      if (!user) {
        return {error: 'User not found'};
      }

      // Get box
      const box = await this.getBoxById(boxId);
      if (!box) {
        return {error: 'Box not found'};
      }

      // Get cost in points
      const cost = this.getBoxCosts()[box.type] || 10;

      // Check if user has enough points
      if (user.points < cost) {
        return {error: Insufficient points, need: cost, have: user.points};
      }

      // Deduct points (send for opening box)
      user.points -= cost;
      await user.save();

      // Roll the prize
      const prize = await this.rollPrize(userId, box);

      // Record history
      await this.models.BoxOpened.create({
        userId,
        boxId,
        prize,
        pointsConsumed: cost,
        type: 'box'
      });

      return {
        success: true,
        box: box,
        prize: prize,
        pointsSpent: cost,
        balance: user.points
      };
    } catch (e) {
      return {error: e.message};
    }
  }

  // Roll prize using PrizingService
  async rollPrize(userId, box) {
      if (!this.prizingService) {
        return null;
      }

      return await this.prizingService.rollPrize(userId, box.type);
    }

  // Get user box opened history
  async getBoxHistory(userId, limit = 10) {
    try {
      const history = await this.models.BoxOpened.find({
        userId: userId
      }).sort({ createdAt: -1})
      .limit(limit);

      return history;
    } catch (e) {
      return [];
    }
  }

  // Calculate box price
  calculateBoxPrice(boxType) {
    const pricesByType = {
      bronze: 10, // $10
      silver: 50, // $50
      gold: 100, // $100
      diamond: 500 // $500
    };
    return pricesByType[boxType] || 10;
  }

  // Get box prices list
  asyng getBoxPrices() {
    return {
      bronze: 10,
      silver: 50,
      gold: 100,
      diamond: 500
    };
  }
}

module.exports = BoxService;
