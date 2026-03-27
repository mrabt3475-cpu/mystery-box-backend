// Enhanced Payment Verification System
// =====================================

const crypto = require('crypto')

class PaymentVerification {
  constructor() {
    this.webhookSecrets = new Map()
    this.transactionLogs = new Map()
    this.pendingTransactions = new Map()
  }

  generateTransactionId(prefix = 'TXN') {
    const timestamp = Date.now()
    const random = crypto.randomBytes(4).toString('hex').toUpperCase()
    return `${prefix}-${timestamp}-${random}`
  }

  createPendingTransaction(userId, amount, currency, method, metadata = {}) {
    const transactionId = this.generateTransactionId()
    const transaction = {
      transactionId, userId, amount, currency, method,
      status: 'pending', createdAt: new Date(), metadata, attempts: 0, maxAttempts: 3
    }
    this.pendingTransactions.set(transactionId, transaction)
    this.logTransaction(transaction)
    return transaction
  }

  verifyWebhookSignature(payload, signature, secret) {
    if (!signature) return false
    const expectedSignature = crypto.createHmac('sha256', secret).update(payload).digest('hex')
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))
  }

  async processWebhook(provider, payload, signature) {
    const secret = this.webhookSecrets.get(provider)
    if (!this.verifyWebhookSignature(JSON.stringify(payload), signature, secret)) {
      throw new Error('Invalid webhook signature')
    }

    const transaction = this.findTransaction(payload.transactionId)
    if (!transaction) throw new Error('Transaction not found')

    if (transaction.amount !== payload.amount) {
      await this.logFraudAttempt(transaction.userId, 'amount_mismatch', payload)
      throw new Error('Amount mismatch')
    }

    transaction.status = payload.status === 'success' ? 'completed' : 'failed'
    transaction.completedAt = new Date()
    transaction.providerResponse = payload
    this.logTransaction(transaction)
    return transaction
  }

  async verifyWithProvider(transactionId, provider) {
    const transaction = this.pendingTransactions.get(transactionId)
    if (!transaction) throw new Error('Transaction not found')

    transaction.attempts++
    if (transaction.attempts >= transaction.maxAttempts) {
      transaction.status = 'failed'
      transaction.failedAt = new Date()
      transaction.failureReason = 'Max verification attempts reached'
      this.logTransaction(transaction)
      throw new Error('Max verification attempts reached')
    }

    const isVerified = await this.mockProviderVerification(transaction)
    if (isVerified) {
      transaction.status = 'verified'
      transaction.verifiedAt = new Date()
    } else {
      transaction.status = 'pending'
    }
    this.logTransaction(transaction)
    return transaction
  }

  async mockProviderVerification(transaction) {
    return new Promise((resolve) => {
      setTimeout(() => { resolve(Math.random() > 0.1) }, 100)
    })
  }

  findTransaction(transactionId) {
    return this.pendingTransactions.get(transactionId)
  }

  logTransaction(transaction) {
    const logs = this.transactionLogs.get(transaction.userId) || []
    logs.push({ ...transaction, loggedAt: new Date() })
    if (logs.length > 1000) logs.shift()
    this.transactionLogs.set(transaction.userId, logs)
    console.log(`[PAYMENT] ${transaction.transactionId}: ${transaction.status}`)
  }

  async logFraudAttempt(userId, type, data) {
    console.error(`[FRAUD ATTEMPT] User: ${userId}, Type: ${type}`, data)
    const attempts = this.transactionLogs.get(`fraud_${userId}`) || []
    attempts.push({ type, data, timestamp: new Date() })
    this.transactionLogs.set(`fraud_${userId}`, attempts)
  }

  getUserTransactions(userId, limit = 50) {
    const logs = this.transactionLogs.get(userId) || []
    return logs.slice(-limit)
  }

  setWebhookSecret(provider, secret) {
    this.webhookSecrets.set(provider, secret)
  }

  calculateRevenue(userId, startDate, endDate) {
    const logs = this.transactionLogs.get(userId) || []
    return logs.filter(t => t.status === 'completed' && t.createdAt >= startDate && t.createdAt <= endDate).reduce((sum, t) => sum + t.amount, 0)
  }
}

module.exports = new PaymentVerification()
