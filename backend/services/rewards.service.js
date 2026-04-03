const crypto = require('crypto');

class RewardsService {
  // Generate random seed for provably fair
  generateSeed() {
    return crypto.randomBytes(32).toString('hex');
  }

  // Select prize using weighted random with provably fair RNG
  async selectPrize(box) {
    if (!box.prizes || box.prizes.length === 0) {
      throw new Error('No prizes in this box');
    }

    // Calculate total weight
    const totalWeight = box.prizes.reduce((sum, p) => sum + p.weight, 0);

    // Generate random number using seed
    const seed = this.generateSeed();
    const hash = crypto.createHash('sha256');
    hash.update(seed + box._id.toString());
    const hashHex = hash.digest('hex');
    const randomNum = parseInt(hashHex.substring(0, 8), 16) / 0xffffffff;

    // Select prize based on weight
    let random = randomNum * totalWeight;
    
    for (const prizeEntry of box.prizes) {
      random -= prizeEntry.weight;
      if (random <= 0) {
        const prize = await Prize.findById(prizeEntry.prizeId);
        if (!prize || !prize.isActive) {
          continue;
        }
        
        // Check max occurrences
        if (prize.maxOccurrences && prize.timesOpened >= prize.maxOccurrences) {
          continue;
        }
        
        return prize;
      }
    }

    // Fallback to first prize
    return await Prize.findById(box.prizes[0].prizeId);
  }

  // Calculate expected value of a box
  async calculateBoxEV(box) {
    if (!box.prizes || box.prizes.length === 0) {
      return 0;
    }

    let totalEV = 0;
    const totalWeight = box.prizes.reduce((sum, p) => sum + p.weight, 0);

    for (const prizeEntry of box.prizes) {
      const prize = await Prize.findById(prizeEntry.prizeId);
      if (prize && prize.isActive) {
        const probability = prizeEntry.weight / totalWeight;
        const value = prize.type === 'points' ? prize.value : 0;
        totalEV += probability * value;
      }
    }

    return totalEV;
  }

  // Budget control - check if box is within budget
  async checkBudget(boxId, dailyBudget, spentToday) {
    const box = await Box.findById(boxId);
    if (!box) return false;
    
    return (spentToday + box.cost) <= dailyBudget;
  }
}

const Prize = require('../models/Prize.model');
const Box = require('../models/Box.model');

module.exports = new RewardsService();
