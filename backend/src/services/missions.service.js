// Missions System
// ==============

const mongoose = require('mongoose')

const missionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  missionId: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['open_boxes', 'win_rarity', 'spend_points', 'refer_friends', 'daily_login', 'spend_amount'],
    required: true 
  },
  target: { type: Number, required: true },
  progress: { type: Number, default: 0 },
  completed: { type: Boolean, default: false },
  reward: {
    type: { type: String, enum: ['points', 'box', 'discount'] },
    amount: Number,
    boxId: mongoose.Schema.Types.ObjectId
  },
  expiresAt: { type: Date },
  completedAt: { type: Date },
  createdAt: { type: Date, default: Date.now }
})

missionSchema.index({ userId: 1, missionId: 1 }, { unique: true })

class MissionService {
  // Generate daily missions for user
  async generateDailyMissions(userId) {
    const missions = [
      {
        missionId: 'open_3_boxes',
        type: 'open_boxes',
        target: 3,
        reward: { type: 'points', amount: 50 }
      },
      {
        missionId: 'open_5_boxes',
        type: 'open_boxes',
        target: 5,
        reward: { type: 'points', amount: 100 }
      },
      {
        missionId: 'win_rare',
        type: 'win_rarity',
        target: 1,
        rarity: 'rare',
        reward: { type: 'points', amount: 75 }
      },
      {
        missionId: 'win_epic',
        type: 'win_rarity',
        target: 1,
        rarity: 'epic',
        reward: { type: 'points', amount: 150 }
      },
      {
        missionId: 'spend_500_points',
        type: 'spend_points',
        target: 500,
        reward: { type: 'points', amount: 50 }
      }
    ]

    const expiresAt = new Date()
    expiresAt.setHours(23, 59, 59, 999)

    const userMissions = []
    for (const mission of missions.slice(0, 3)) {
      const existing = await Mission.findOne({ userId, missionId: mission.missionId })
      if (!existing) {
        const newMission = await Mission.create({
          userId,
          ...mission,
          expiresAt
        })
        userMissions.push(newMission)
      }
    }

    return userMissions
  }

  // Update mission progress
  async updateProgress(userId, type, value) {
    const missions = await Mission.find({
      userId,
      type,
      completed: false,
      expiresAt: { $gt: new Date() }
    })

    for (const mission of missions) {
      if (type === 'win_rarity') {
        if (value >= (mission.rarity || 0)) {
          mission.progress += 1
        }
      } else {
        mission.progress += value
      }

      if (mission.progress >= mission.target) {
        mission.completed = true
        mission.completedAt = new Date()
        await this.giveReward(userId, mission.reward)
      }

      await mission.save()
    }
  }

  // Give reward to user
  async giveReward(userId, reward) {
    const User = mongoose.model('User')
    const user = await User.findById(userId)

    switch (reward.type) {
      case 'points':
        user.points += reward.amount
        break
      case 'box':
        // Add free box to user inventory
        break
      case 'discount':
        // Add discount code
        break
    }

    await user.save()
  }

  // Get user missions
  async getUserMissions(userId) {
    return Mission.find({
      userId,
      expiresAt: { $gt: new Date() }
    }).sort({ createdAt: -1 })
  }

  // Calculate total XP from missions
  async calculateMissionXP(userId) {
    const completed = await Mission.find({ userId, completed: true })
    return completed.length * 10 // 10 XP per completed mission
  }
}

const Mission = mongoose.model('Mission', missionSchema)

module.exports = { Mission, MissionService: new MissionService() }
