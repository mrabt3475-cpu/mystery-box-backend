// Levels & XP System
// ==================

const mongoose = require('mongoose')

const userLevelSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  level: { type: Number, default: 1 },
  xp: { type: Number, default: 0 },
  totalXp: { type: Number, default: 0 },
  title: { type: String, default: 'مبتدئ' },
  benefits: {
    discount: { type: Number, default: 0 },
    extraPoints: { type: Number, default: 0 },
    exclusiveBoxes: { type: Boolean, default: false }
  },
  updatedAt: { type: Date, default: Date.now }
})

// Level configuration
const LEVEL_CONFIG = {
  1: { title: 'مبتدئ', minXp: 0, discount: 0 },
  2: { title: 'متدرب', minXp: 100, discount: 1 },
  3: { title: 'لاعب', minXp: 250, discount: 2 },
  4: { title: 'محترف', minXp: 500, discount: 3 },
  5: { title: 'خبير', minXp: 1000, discount: 5 },
  6: { title: 'ماستر', minXp: 2000, discount: 6 },
  7: { title: 'أسطوري', minXp: 3500, discount: 8 },
  8: { title: 'محظوظ', minXp: 5500, discount: 10 },
  9: { title: 'مميز', minXp: 8000, discount: 12 },
  10: { title: 'VIP', minXp: 12000, discount: 15 },
  15: { title: 'Diamond', minXp: 25000, discount: 20 },
  20: { title: 'Platinum', minXp: 50000, discount: 25 },
  30: { title: 'Elite', minXp: 100000, discount: 30 },
  50: { title: 'Legend', minXp: 250000, discount: 40 },
  100: { title: 'God', minXp: 1000000, discount: 50 }
}

// XP sources
const XP_SOURCES = {
  open_box: 10,
  win_prize: 15,
  win_rare: 25,
  win_epic: 50,
  win_legendary: 100,
  daily_login: 5,
  complete_mission: 20,
  refer_friend: 30,
  purchase: 1, // per dollar
}

class LevelService {
  // Get or create user level
  async getUserLevel(userId) {
    let userLevel = await UserLevel.findOne({ userId })
    
    if (!userLevel) {
      userLevel = await UserLevel.create({ userId })
    }

    return userLevel
  }

  // Add XP to user
  async addXP(userId, source, multiplier = 1) {
    const userLevel = await this.getUserLevel(userId)
    const xpGain = (XP_SOURCES[source] || 10) * multiplier

    userLevel.xp += xpGain
    userLevel.totalXp += xpGain

    // Check for level up
    await this.checkLevelUp(userLevel)
    await userLevel.save()

    return {
      xpGain,
      newXp: userLevel.xp,
      level: userLevel.level,
      title: userLevel.title
    }
  }

  // Check and process level up
  async checkLevelUp(userLevel) {
    let leveledUp = false
    let newLevel = userLevel.level

    // Find next level
    while (LEVEL_CONFIG[newLevel + 1] && 
           userLevel.xp >= LEVEL_CONFIG[newLevel + 1].minXp) {
      newLevel++
      leveledUp = true
    }

    if (leveledUp) {
      const config = LEVEL_CONFIG[newLevel]
      userLevel.level = newLevel
      userLevel.title = config.title
      userLevel.benefits = {
        discount: config.discount,
        extraPoints: newLevel * 2,
        exclusiveBoxes: newLevel >= 10
      }
      userLevel.updatedAt = new Date()

      // Give level up bonus
      const User = mongoose.model('User')
      const user = await User.findById(userLevel.userId)
      user.points += newLevel * 10
      await user.save()
    }
  }

  // Get level info
  async getLevelInfo(userId) {
    const userLevel = await this.getUserLevel(userId)
    const currentConfig = LEVEL_CONFIG[userLevel.level]
    const nextConfig = LEVEL_CONFIG[userLevel.level + 1]

    return {
      level: userLevel.level,
      title: userLevel.title,
      xp: userLevel.xp,
      totalXp: userLevel.totalXp,
      currentLevelXp: currentConfig?.minXp || 0,
      nextLevelXp: nextConfig?.minXp || null,
      progress: nextConfig 
        ? ((userLevel.xp - currentConfig.minXp) / (nextConfig.minXp - currentConfig.minXp)) * 100
        : 100,
      benefits: userLevel.benefits,
      levelConfig: LEVEL_CONFIG
    }
  }

  // Get user discount
  async getDiscount(userId) {
    const userLevel = await this.getUserLevel(userId)
    return userLevel.benefits.discount
  }

  // Get leaderboard by XP
  async getXpLeaderboard(limit = 10) {
    return UserLevel.find()
      .sort({ totalXp: -1 })
      .limit(limit)
      .populate('userId', 'username avatar')
  }
}

const UserLevel = mongoose.model('UserLevel', userLevelSchema)

module.exports = { UserLevel, LevelService: new LevelService(), LEVEL_CONFIG, XP_SOURCES }
