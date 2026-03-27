// Daily Rewards System
// ===================

const mongoose = require('mongoose')

const dailyRewardSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  streak: { type: Number, default: 0 },
  lastClaimed: { type: Date },
  totalClaimed: { type: Number, default: 0 },
  consecutiveDays: { type: Number, default: 0 },
  rewards: [{
    day: Number,
    claimed: Boolean,
    claimedAt: Date
  }]
})

// Reward configuration
const REWARD_CONFIG = {
  1: { points: 10, box: null },
  2: { points: 20, box: null },
  3: { points: 30, box: null },
  4: { points: 40, box: null },
  5: { points: 50, box: 'bronze' },
  6: { points: 60, box: null },
  7: { points: 100, box: 'silver' },
  8: { points: 70, box: null },
  9: { points: 80, box: null },
  10: { points: 90, box: null },
  11: { points: 100, box: null },
  12: { points: 110, box: null },
  13: { points: 120, box: null },
  14: { points: 200, box: 'gold' },
}

class DailyRewardService {
  // Initialize daily rewards for user
  async initialize(userId) {
    let reward = await DailyReward.findOne({ userId })
    
    if (!reward) {
      reward = await DailyReward.create({
        userId,
        rewards: Object.keys(REWARD_CONFIG).map(day => ({
          day: parseInt(day),
          claimed: false
        }))
      })
    }

    return reward
  }

  // Claim daily reward
  async claimReward(userId) {
    const reward = await this.initialize(userId)
    const now = new Date()
    const lastClaimed = reward.lastClaimed

    // Check if can claim
    if (lastClaimed) {
      const hoursSinceLastClaim = (now - lastClaimed) / (1000 * 60 * 60)
      if (hoursSinceLastClaim < 20) {
        const remainingHours = 20 - hoursSinceLastClaim
        throw new Error(`Can claim in ${Math.ceil(remainingHours)} hours`)
      }

      // Check if streak continues
      const daysSinceLastClaim = Math.floor((now - lastClaimed) / (1000 * 60 * 60 * 24))
      if (daysSinceLastClaim <= 1) {
        reward.streak++
      } else {
        reward.streak = 1
        // Reset all rewards
        reward.rewards.forEach(r => {
          r.claimed = false
        })
      }
    } else {
      reward.streak = 1
    }

    // Get current day reward
    const currentDay = ((reward.streak - 1) % 14) + 1
    const rewardConfig = REWARD_CONFIG[currentDay]

    // Check if already claimed
    const dayReward = reward.rewards.find(r => r.day === currentDay)
    if (dayReward?.claimed) {
      throw new Error('Reward already claimed today')
    }

    // Give reward
    const User = mongoose.model('User')
    const user = await User.findById(userId)
    user.points += rewardConfig.points
    await user.save()

    // Update reward record
    dayReward.claimed = true
    dayReward.claimedAt = now
    reward.lastClaimed = now
    reward.consecutiveDays++
    reward.totalClaimed += rewardConfig.points

    await reward.save()

    return {
      day: currentDay,
      streak: reward.streak,
      points: rewardConfig.points,
      box: rewardConfig.box,
      totalStreak: reward.consecutiveDays
    }
  }

  // Get reward status
  async getStatus(userId) {
    const reward = await this.initialize(userId)
    const currentDay = ((reward.streak) % 14) + 1
    const dayReward = reward.rewards.find(r => r.day === currentDay)

    let nextClaimTime = null
    if (reward.lastClaimed) {
      const nextClaim = new Date(reward.lastClaimed)
      nextClaim.setHours(nextClaim.getHours() + 20)
      if (nextClaim > new Date()) {
        nextClaimTime = nextClaim
      }
    }

    return {
      streak: reward.streak,
      currentDay,
      canClaim: !dayReward?.claimed && !nextClaimTime,
      nextClaimTime,
      totalClaimed: reward.totalClaimed,
      rewards: reward.rewards
    }
  }
}

const DailyReward = mongoose.model('DailyReward', dailyRewardSchema)

module.exports = { DailyReward, DailyRewardService: new DailyRewardService() }
