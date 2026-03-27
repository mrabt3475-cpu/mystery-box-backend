// Dynamic Pricing & Loss Recovery System
// ==========================================

class PricingService {
  constructor() {
    this.basePrices = new Map() // boxId -> basePrice
    this.demandFactors = new Map() // boxId -> demand score
    this.timeFactors = {
      peak: 1.2,      // Peak hours (8pm-12am)
      normal: 1.0,    // Normal hours
      offPeak: 0.9,   // Off peak (2am-8am)
      weekend: 1.1    // Weekend boost
    }
  }

  // Set base price for box
  setBasePrice(boxId, price) {
    this.basePrices.set(boxId, price)
  }

  // Update demand factor
  updateDemand(boxId, purchases, opens) {
    const current = this.demandFactors.get(boxId) || 1.0
    const demand = purchases > 0 ? opens / purchases : 1.0
    
    // Smooth the demand factor
    const newDemand = (current * 0.7) + (demand * 0.3)
    this.demandFactors.set(boxId, newDemand)
  }

  // Get current time factor
  getTimeFactor() {
    const now = new Date()
    const hour = now.getHours()
    const day = now.getDay()

    // Weekend boost
    if (day === 0 || day === 6) {
      return this.timeFactors.weekend
    }

    // Peak hours
    if (hour >= 20 && hour <= 23) {
      return this.timeFactors.peak
    }

    // Off peak
    if (hour >= 2 && hour <= 7) {
      return this.timeFactors.offPeak
    }

    return this.timeFactors.normal
  }

  // Calculate dynamic price
  calculatePrice(boxId, userId = null) {
    const basePrice = this.basePrices.get(boxId) || 100
    const demandFactor = this.demandFactors.get(boxId) || 1.0
    const timeFactor = this.getTimeFactor()

    // Apply factors
    let price = basePrice * demandFactor * timeFactor

    // Apply user level discount
    // In production, get from LevelService
    const levelDiscount = 0 // await LevelService.getDiscount(userId)
    price = price * (1 - levelDiscount / 100)

    // Round to nearest integer
    return Math.round(price)
  }

  // Get price with loss recovery
  async getPriceWithRecovery(userId, boxId) {
    let price = this.calculatePrice(boxId)
    const recovery = await this.calculateLossRecovery(userId)

    if (recovery.applicable) {
      price = price * (1 - recovery.discount)
    }

    return {
      price: Math.round(price),
      originalPrice: this.basePrices.get(boxId) || 100,
      recovery: recovery
    }
  }
}

// Loss Recovery System
class LossRecoveryService {
  constructor() {
    this.userStats = new Map() // userId -> { losses, lastLoss, threshold }
    this.threshold = 5 // Lose 5 in a row
    this.recoveryDiscount = 0.2 // 20% discount
    this.recoveryWindow = 60 * 60 * 1000 // 1 hour
  }

  // Record a loss
  recordLoss(userId) {
    const stats = this.getUserStats(userId)
    
    // Check if in recovery window
    if (stats.lastLoss && (Date.now() - stats.lastLoss) > this.recoveryWindow) {
      stats.losses = 0
    }

    stats.losses++
    stats.lastLoss = Date.now()

    this.userStats.set(userId, stats)
  }

  // Record a win
  recordWin(userId) {
    const stats = this.getUserStats(userId)
    
    // If user wins, reduce loss streak
    if (stats.losses > 0) {
      stats.losses = Math.max(0, stats.losses - 1)
    }

    this.userStats.set(userId, stats)
  }

  // Get user stats
  getUserStats(userId) {
    return this.userStats.get(userId) || {
      losses: 0,
      lastLoss: null,
      recoveryUsed: false
    }
  }

  // Calculate loss recovery
  async calculateLossRecovery(userId) {
    const stats = this.getUserStats(userId)

    // Check if user qualifies for recovery
    if (stats.losses >= this.threshold && !stats.recoveryUsed) {
      return {
        applicable: true,
        discount: this.recoveryDiscount,
        reason: 'Loss streak recovery',
        losses: stats.losses
      }
    }

    return {
      applicable: false,
      discount: 0,
      losses: stats.losses
    }
  }

  // Use recovery
  useRecovery(userId) {
    const stats = this.getUserStats(userId)
    stats.recoveryUsed = true
    stats.losses = 0
    this.userStats.set(userId, stats)
  }

  // Reset recovery (new day)
  resetDaily(userId) {
    const stats = this.getUserStats(userId)
    stats.recoveryUsed = false
    this.userStats.set(userId, stats)
  }
}

module.exports = {
  PricingService: new PricingService(),
  LossRecoveryService: new LossRecoveryService()
}
