// Anti-Fraud System
// ==================

const crypto = require('crypto')

class AntiFraudSystem {
  constructor() {
    this.suspiciousActivities = new Map()
    this.riskScores = new Map()
    this.fraudPatterns = [
      { name: 'rapid_betting', threshold: 10, timeWindow: 60000, risk: 30 },
      { name: 'unusual_amount', minAmount: 1000, risk: 40 },
      { name: 'multiple_accounts', threshold: 3, timeWindow: 3600000, risk: 50 },
      { name: 'vpn_detected', risk: 20 },
      { name: 'new_account_high_bet', accountAge: 86400000, risk: 35 },
      { name: 'rapid_deposits', threshold: 5, timeWindow: 300000, risk: 45 },
    ]
  }

  async calculateRiskScore(userId, action, metadata = {}) {
    let totalRisk = 0
    const flags = []

    if (action === 'bet') {
      const rapidBetting = await this.checkRapidBetting(userId)
      if (rapidBetting.flagged) {
        totalRisk += 30
        flags.push('rapid_betting')
      }
    }

    if (action === 'deposit' || action === 'withdraw') {
      const unusualAmount = this.checkUnusualAmount(metadata.amount)
      if (unusualAmount.flagged) {
        totalRisk += 40
        flags.push('unusual_amount')
      }

      const rapidDeposits = await this.checkRapidDeposits(userId)
      if (rapidDeposits.flagged) {
        totalRisk += 45
        flags.push('rapid_deposits')
      }
    }

    if (metadata.isVPN) {
      totalRisk += 20
      flags.push('vpn_detected')
    }

    if (metadata.accountAge < 86400000 && metadata.betAmount > 100) {
      totalRisk += 35
      flags.push('new_account_high_bet')
    }

    this.riskScores.set(userId, {
      score: totalRisk,
      flags,
      lastUpdated: new Date()
    })

    return {
      riskScore: totalRisk,
      riskLevel: this.getRiskLevel(totalRisk),
      flags,
      shouldBlock: totalRisk >= 70,
      shouldReview: totalRisk >= 40
    }
  }

  async checkRapidBetting(userId) {
    const activities = this.suspiciousActivities.get(userId) || []
    const now = Date.now()
    const oneMinuteAgo = now - 60000
    const recentBets = activities.filter(a => a.action === 'bet' && a.timestamp > oneMinuteAgo)
    return { flagged: recentBets.length >= 10, count: recentBets.length }
  }

  checkUnusualAmount(amount) {
    return { flagged: amount >= 1000, amount }
  }

  async checkRapidDeposits(userId) {
    const activities = this.suspiciousActivities.get(userId) || []
    const now = Date.now()
    const fiveMinutesAgo = now - 300000
    const recentDeposits = activities.filter(a => a.action === 'deposit' && a.timestamp > fiveMinutesAgo)
    return { flagged: recentDeposits.length >= 5, count: recentDeposits.length }
  }

  getRiskLevel(score) {
    if (score >= 70) return 'HIGH'
    if (score >= 40) return 'MEDIUM'
    return 'LOW'
  }

  logActivity(userId, action, metadata = {}) {
    const activities = this.suspiciousActivities.get(userId) || []
    activities.push({ action, timestamp: Date.now(), ...metadata })
    if (activities.length > 100) activities.shift()
    this.suspiciousActivities.set(userId, activities)
  }

  async blockUser(userId, reason, duration = null) {
    const block = { userId, reason, blockedAt: new Date(), duration, blockedUntil: duration ? new Date(Date.now() + duration) : null }
    console.log(`[FRAUD] User blocked: ${userId}, reason: ${reason}`)
    return block
  }

  getUserRiskInfo(userId) {
    return this.riskScores.get(userId) || { score: 0, flags: [], lastUpdated: null }
  }
}

module.exports = new AntiFraudSystem()
