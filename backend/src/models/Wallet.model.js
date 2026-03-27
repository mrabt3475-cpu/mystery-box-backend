// Advanced Wallet with Analytics
// ===============================

const mongoose = require('mongoose')

const walletSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  // Balances
  balance: { type: Number, default: 0 },
  bonusBalance: { type: Number, default: 0 },
  pendingBalance: { type: Number, default: 0 },
  
  // Channel earnings
  channelEarnings: {
    commissions: { type: Number, default: 0 },
    donations: { type: Number, default: 0 },
    productSales: { type: Number, default: 0 }
  },
  
  // Spending
  spending: {
    totalSpent: { type: Number, default: 0 },
    purchases: { type: Number, default: 0 },
    boxOpens: { type: Number, default: 0 },
    donations: { type: Number, default: 0 },
    channelJoins: { type: Number, default: 0 }
  },
  
  // Earnings
  earnings: {
    totalEarned: { type: Number, default: 0 },
    fromSales: { type: Number, default: 0 },
    fromReferrals: { type: Number, default: 0 },
    fromDonations: { type: Number, default: 0 },
    fromChannels: { type: Number, default: 0 }
  },
  
  // Analytics
  analytics: {
    firstTransaction: Date,
    lastTransaction: Date,
    averageTransaction: { type: Number, default: 0 },
    largestWin: { type: Number, default: 0 },
    largestLoss: { type: Number, default: 0 },
    streakDays: { type: Number, default: 0 }
  },
  
  // Payout settings
  payoutSettings: {
    method: { type: String, enum: ['wallet', 'bank', 'crypto'], default: 'wallet' },
    address: String, // Encrypted for crypto
    bankAccount: String // Encrypted
  },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

// Add points
walletSchema.methods.addPoints = async function(amount, type, description) {
  this.balance += amount
  
  // Update category
  switch (type) {
    case 'commission':
      this.channelEarnings.commissions += amount
      this.earnings.fromChannels += amount
      break
    case 'donation_received':
      this.channelEarnings.donations += amount
      this.earnings.fromDonations += amount
      break
    case 'product_sale':
      this.channelEarnings.productSales += amount
      this.earnings.fromSales += amount
      break
  }
  
  this.earnings.totalEarned += amount
  this.analytics.lastTransaction = new Date()
  if (!this.analytics.firstTransaction) {
    this.analytics.firstTransaction = new Date()
  }
  
  await this.save()
  
  // Log transaction
  await this.logTransaction(amount, 'credit', type, description)
  
  return this
}

// Deduct points
walletSchema.methods.deductPoints = async function(amount, type, description) {
  if (this.balance < amount) {
    throw new Error('Insufficient balance')
  }
  
  this.balance -= amount
  this.spending.totalSpent += amount
  
  switch (type) {
    case 'purchase':
      this.spending.purchases += 1
      break
    case 'box_open':
      this.spending.boxOpens += 1
      break
    case 'donation_sent':
      this.spending.donations += amount
      break
    case 'channel_join':
      this.spending.channelJoins += amount
      break
  }
  
  this.analytics.lastTransaction = new Date()
  await this.save()
  
  await this.logTransaction(amount, 'debit', type, description)
  
  return this
}

// Log transaction
walletSchema.methods.logTransaction = async function(amount, direction, type, description) {
  const Transaction = mongoose.model('WalletTransaction')
  
  await Transaction.create({
    user: this.user,
    amount,
    direction,
    type,
    description,
    balanceAfter: this.balance
  })
  
  // Update analytics
  await this.updateAnalytics(amount, direction)
}

// Update analytics
walletSchema.methods.updateAnalytics = async function(amount, direction) {
  if (direction === 'credit' && amount > this.analytics.largestWin) {
    this.analytics.largestWin = amount
  }
  if (direction === 'debit' && amount > this.analytics.largestLoss) {
    this.analytics.largestLoss = amount
  }
  
  // Calculate average
  const Transaction = mongoose.model('WalletTransaction')
  const count = await Transaction.countDocuments({ user: this.user })
  const total = await Transaction.aggregate([
    { $match: { user: this.user } },
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ])
  
  if (count > 0 && total.length > 0) {
    this.analytics.averageTransaction = total[0].total / count
  }
  
  await this.save()
}

// Get analytics summary
walletSchema.methods.getAnalyticsSummary = function() {
  const now = new Date()
  const thirtyDaysAgo = new Date(now - 30 * 24 * 60 * 60 * 1000)
  
  return {
    currentBalance: this.balance,
    totalEarned: this.earnings.totalEarned,
    totalSpent: this.spending.totalSpent,
    netProfit: this.earnings.totalEarned - this.spending.totalSpent,
    spendingBreakdown: this.spending,
    earningsBreakdown: this.earnings,
    channelBreakdown: this.channelEarnings,
    largestWin: this.analytics.largestWin,
    largestLoss: this.analytics.largestLoss,
    averageTransaction: this.analytics.averageTransaction,
    memberSince: this.analytics.firstTransaction,
    lastActive: this.analytics.lastTransaction
  }
}

// Static method to get or create wallet
walletSchema.statics.getOrCreate = async function(userId) {
  let wallet = await this.findOne({ user: userId })
  if (!wallet) {
    wallet = await this.create({ user: userId })
  }
  return wallet
}

const Wallet = mongoose.model('Wallet', walletSchema)

// Transaction Schema
const transactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  direction: { type: String, enum: ['credit', 'debit'], required: true },
  type: { type: String, required: true },
  description: String,
  balanceAfter: { type: Number, required: true },
  relatedUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  relatedChannel: { type: mongoose.Schema.Types.ObjectId, ref: 'Channel' },
  createdAt: { type: Date, default: Date.now }
})

transactionSchema.index({ user: 1, createdAt: -1 })
transactionSchema.index({ type: 1 })

const WalletTransaction = mongoose.model('WalletTransaction', transactionSchema)

module.exports = { Wallet, WalletTransaction }
