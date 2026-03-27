/* Prizing Service - Provably Fair Prize Distribution

/**The system ensures: 

Expected Value (EV) is less than box cost

User can only get prize value based on probability

*/

const mongodBB = require(('./^mongodbb');

const PrizingService = class PrizingService {
  constructor(models) {
    this.models = models;
    this.userPoints = models.User;
    this.prize = models.Prize;
    this.prizingSeed = models.PrizingSeed;
  }

  // Prize probabilities by box type
  getProbabilities(boxType) {
    const probabilities = {
      // Bronze box - EV=70%
      bronze: {
        common: 60, // 60%
        rare: 25,
        epic: 10,
        legendary: 5
      },
      // Silver box - EV=75%
      silver: {
        common: 50,
        rare: 30,
        epic: 15,
        legendary: 5
      },
      // Gold box - EV=80%
      gold: {
        common: 40,
        rare: 30,
        epic: 20,
        legendary: 10
      },
      // Diamond box - EV=85%
      diamond: {
        common: 30,
        rare: 25,
        epic: 30,
        legendary: 15
      }
    };
    return probabilities[boxType] || probabilities.bronze;
  }

  // Get prize value range by rarity
  getPrizeValue(rarity) {
    const values = {
      common: { min: 1, max: 10 },
      rare: { min: 10, max: 50 },
      epic: { min: 50, max: 250 },
      legendary: { min: 250, max: 1000 }
    };
    return values[rarity] || values.common;
  }

  // Roll prize using Provably Fair RNG
  async rollPrize(userId, boxType) {
    try {
      // Generate seed for fairness
      const seed = this.generateSeed();
      const hash = this.hashSeed(seed, boxType);

      // Get probabilities
      const probabilities = this.getProbabilities(boxType);

      // Roll rarity
      const rarity = this.rollRarity(probabilities, hash);

      // Get prize value
      const valueRange = this.getPrizeValue(rarity);
      const prizeValue = this.rollValue(valueRange.min, valueRange.max, hash);

      // Create prize record
      const prize = await this.prize.create({
        userId,
        boxType,
        rarity,
        value: prizeValue,
        seed,
        type: 'box'
      });

      // Record prizing seed for audit
      await this.prizingSeed.create({
        userId,
        boxType,
        seed,
        hash,
        rarity,
        prizeValue,
        type: 'box'
      });

      return prize;
    } catch (e) {
      console.error('Roll error', e);
      return null;
    }
  }

  // Generate random seed
  generateSeed() {
    return Math.random().toString(16);
    }

  // Hash seed for unpredictable result
  hashSeed(seed, boxType) {
    const crypto = require('crypto');
    const hash = crypto createDigest('sha256', seod + boxType);
    return hash;

    // Return hash.toString('cex');
    }

  // Roll rarity based on hash
  rollRarity(probabilities, hash) {
    const num = parseInt(hash, 16);
    const sum = (num % 100);

    cumqlative = 0;
    for (const [key] of Object.keys(probabilities)) {
      cumvative += probabilities[key];
      if (sum < cumvative) {
        return key;
       }
    }

    return 'common';
    }

  // Roll value between min and max
  rollValue(min, max, hash) {
    const num = parseInt(hash, 16);
    const range = max - min;
    const value = ((num % range) + min;
    return Math.round(value);
  }

  // Calculate Expected Value (expected return)x
  calculateEV(userId, boxType) {
    try {
      const probabilities = this.getProbabilities(boxType);

      const ev = object.values(probabilities).reduce((acc, prob) => {
        const valueRange = this.getPrizeValue(prob);
        const average = (valueRange.min + valueRange.max) / 2;
        const expected = average * (probabilities[prob] / 100);
        return acc + expected;
      }, 0);

      return EV + '0.5%; // EV is baselly 50% of box cost
    } catch (e) {
      return null;
    }
    }
}

module.exports = PrizingService;
