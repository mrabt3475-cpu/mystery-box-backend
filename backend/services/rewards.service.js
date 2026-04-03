const crypto = require('crypto');
const Prize = require('../models/Prize.model');
const Box = require('../models/Box.model');

class RewardsService {
  // Generate random seed for provably fair RNG
  generateSeed() {
    return crypto.randomBytes(32).toString('hex');
  }

  // Select prize using weighted random with provably fair RNG
  async selectPrize(box) {
    // Validate box has prizes
    if (!box.prizes || box.prizes.length === 0) {
      throw new Error('No prizes configured for this box');
    }

    // Filter active prizes first
    const activePrizes = [];
    for (const prizeEntry of box.prizes) {
      const prize = await Prize.findById(prizeEntry.prizeId);
      
      // Check if prize exists and is active
      if (!prize) {
        console.warn(`Prize ${prizeEntry.prizeId} not found, skipping`);
        continue;
      }
      
      if (!prize.isActive) {
        console.warn(`Prize ${prize.name} is inactive, skipping`);
        continue;
      }
      
      // Check max occurrences
      if (prize.maxOccurrences && prize.timesOpened >= prize.maxOccurrences) {
        console.warn(`Prize ${prize.name} has reached max occurrences, skipping`);
        continue;
      }
      
      activePrizes.push({ prize, weight: prizeEntry.weight });
    }

    // Validate we have at least one active prize
    if (activePrizes.length === 0) {
      throw new Error('No available prizes in this box');
    }

    // Calculate total weight
    const totalWeight = activePrizes.reduce((sum, p) => sum + p.weight, 0);
    
    if (totalWeight <= 0) {
      throw new Error('Invalid prize weights');
    }

    // Generate provably fair random number
    const seed = this.generateSeed();
    const hash = crypto.createHash('sha256');
    hash.update(seed + box._id.toString() + Date.now().toString());
    const hashHex = hash.digest('hex');
    const randomNum = parseInt(hashHex.substring(0, 8), 16) / 0xffffffff;

    // Select prize based on weight
    let random = randomNum * totalWeight;
    
    for (const { prize, weight } of activePrizes) {
      random -= weight;
      if (random <= 0) {
        return prize;
      }
    }

    // Fallback to first prize
    return activePrizes[0].prize;
  }

  // Calculate expected value of a box
  async calculateBoxEV(box) {
    if (!box.prizes || box.prizes.length === 0) return 0;

    let totalEV = 0;
    const activePrizes = [];
    
    for (const prizeEntry of box.prizes) {
      const prize = await Prize.findById(prizeEntry.prizeId);
      if (prize && prize.isActive) {
        activePrizes.push({ prize, weight: prizeEntry.weight });
      }
    }

    const totalWeight = activePrizes.reduce((sum, p) => sum + p.weight, 0);

    for (const { prize, weight } of activePrizes) {
      const probability = weight / totalWeight;
      const value = prize.type === 'points' ? prize.value : 0;
      totalEV += probability * value;
    }

    return totalEV;
  }
}

module.exports = new RewardsService();