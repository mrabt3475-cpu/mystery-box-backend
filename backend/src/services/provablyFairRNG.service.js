// Provably Fair RNG System
// =========================

const crypto = require('crypto')

class ProvablyFairRNG {
  constructor(serverSeed = null) {
    this.serverSeed = serverSeed || this.generateSeed()
    this.nonce = 0
  }

  generateSeed() {
    return crypto.randomBytes(32).toString('hex')
  }

  hmac(key, message) {
    return crypto.createHmac('sha256', key).update(message).digest('hex')
  }

  generateResult(clientSeed, nonce, range = 100) {
    const message = `${clientSeed}:${nonce}`
    const hash = this.hmac(this.serverSeed, message)
    const max = Math.pow(2, 32)
    const hashInt = parseInt(hash.substring(0, 8), 16)
    const result = (hashInt / max) * range
    return Math.floor(result)
  }

  generateFloat(clientSeed, nonce) {
    const message = `${clientSeed}:${nonce}`
    const hash = this.hmac(this.serverSeed, message)
    const max = Math.pow(2, 64)
    const hashInt = BigInt('0x' + hash.substring(0, 16))
    return Number(hashInt) / Number(max)
  }

  selectFromArray(clientSeed, nonce, array) {
    const index = this.generateResult(clientSeed, nonce, array.length)
    return array[index]
  }

  generateMultiple(clientSeed, nonce, count, range = 100) {
    const results = []
    for (let i = 0; i < count; i++) {
      results.push(this.generateResult(clientSeed, nonce + i, range))
    }
    return results
  }

  verifyResult(serverSeed, clientSeed, nonce, range, expectedResult) {
    const message = `${clientSeed}:${nonce}`
    const hash = this.hmac(serverSeed, message)
    const max = Math.pow(2, 32)
    const hashInt = parseInt(hash.substring(0, 8), 16)
    const result = Math.floor((hashInt / max) * range)
    return result === expectedResult
  }

  getServerSeedHash() {
    return crypto.createHash('sha256').update(this.serverSeed).digest('hex')
  }

  rotateSeed() {
    const oldSeed = this.serverSeed
    this.serverSeed = this.generateSeed()
    this.nonce = 0
    return {
      oldSeedHash: crypto.createHash('sha256').update(oldSeed).digest('hex'),
      newSeed: this.serverSeed
    }
  }

  calculateHouseEdge(betAmount, payout, winProbability) {
    const expectedReturn = payout * winProbability
    const houseEdge = 1 - expectedReturn
    return {
      houseEdge: houseEdge * 100,
      expectedReturn: expectedReturn * 100,
      profit: betAmount * (payout - 1) * winProbability - betAmount * (1 - winProbability)
    }
  }
}

function createRNG(serverSeed = null) {
  return new ProvablyFairRNG(serverSeed)
}

module.exports = { ProvablyFairRNG, createRNG }
