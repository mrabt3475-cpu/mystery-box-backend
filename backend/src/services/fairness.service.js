// Provably Fair Verification System
// ===============================

const crypto = require('crypto')

class FairnessSystem {
  constructor() {
    this.serverSeeds = new Map() // userId -> { seed, hash, rotatedAt }
  }

  // Generate new seed pair for user
  generateSeedPair(userId) {
    const serverSeed = crypto.randomBytes(32).toString('hex')
    const serverSeedHash = crypto.createHash('sha256').update(serverSeed).digest('hex')
    
    this.serverSeeds.set(userId, {
      seed: serverSeed,
      hash: serverSeedHash,
      rotatedAt: new Date(),
      clientSeeds: []
    })
    
    return {
      serverSeedHash,
      rotatedAt: new Date()
    }
  }

  // Get current seed info for user
  getSeedInfo(userId) {
    const seedData = this.serverSeeds.get(userId)
    if (!seedData) {
      return this.generateSeedPair(userId)
    }
    return {
      serverSeedHash: seedData.hash,
      rotatedAt: seedData.rotatedAt
    }
  }

  // Rotate seed (user can do this)
  rotateSeed(userId) {
    return this.generateSeedPair(userId)
  }

  // Generate result using HMAC-SHA256
  generateResult(userId, clientSeed, nonce, range = 100) {
    const seedData = this.serverSeeds.get(userId)
    if (!seedData) {
      this.generateSeedPair(userId)
      return this.generateResult(userId, clientSeed, nonce, range)
    }

    const message = `${clientSeed}:${nonce}`
    const hmac = crypto.createHmac('sha256', seedData.seed)
    const hash = hmac.update(message).digest('hex')
    
    // Convert to number
    const max = Math.pow(2, 32)
    const hashInt = parseInt(hash.substring(0, 8), 16)
    const result = Math.floor((hashInt / max) * range)
    
    return {
      result,
      hash,
      serverSeed: seedData.seed,
      clientSeed,
      nonce
    }
  }

  // Verify result (for transparency)
  verify(serverSeedHash, clientSeed, nonce, range, result) {
    // Find user with this hash
    let foundSeed = null
    for (const [userId, data] of this.serverSeeds) {
      if (data.hash === serverSeedHash) {
        foundSeed = data.seed
        break
      }
    }

    if (!foundSeed) return { valid: false, error: 'Seed not found' }

    const message = `${clientSeed}:${nonce}`
    const hmac = crypto.createHmac('sha256', foundSeed)
    const hash = hmac.update(message).digest('hex')
    
    const max = Math.pow(2, 32)
    const hashInt = parseInt(hash.substring(0, 8), 16)
    const expectedResult = Math.floor((hashInt / max) * range)

    return {
      valid: expectedResult === result,
      expected: expectedResult,
      received: result,
      hash
    }
  }

  // Log opening for replay
  logOpening(userId, boxId, openingData) {
    const seedData = this.serverSeeds.get(userId)
    if (!seedData) return

    seedData.clientSeeds.push({
      boxId,
      ...openingData,
      timestamp: new Date()
    })

    // Keep only last 100
    if (seedData.clientSeeds.length > 100) {
      seedData.clientSeeds.shift()
    }
  }

  // Get opening history
  getHistory(userId, limit = 20) {
    const seedData = this.serverSeeds.get(userId)
    if (!seedData) return []
    return seedData.clientSeeds.slice(-limit)
  }
}

module.exports = new FairnessSystem()
