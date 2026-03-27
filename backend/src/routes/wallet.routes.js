// API Routes for Wallet
// =====================

const express = require('express')
const router = express.Router()
const { Wallet, WalletTransaction } = require('../models/Wallet.model')
const { auth } = require('../middleware/auth.middleware')

// Get my wallet
router.get('/', auth, async (req, res) => {
  try {
    const wallet = await Wallet.getOrCreate(req.user._id)
    
    res.json({ 
      success: true, 
      data: {
        ...wallet.toObject(),
        analytics: wallet.getAnalyticsSummary()
      }
    })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// Get transaction history
router.get('/transactions', auth, async (req, res) => {
  try {
    const { page = 1, limit = 20, type, startDate, endDate } = req.query
    
    const query = { user: req.user._id }
    
    if (type) query.type = type
    if (startDate || endDate) {
      query.createdAt = {}
      if (startDate) query.createdAt.$gte = new Date(startDate)
      if (endDate) query.createdAt.$lte = new Date(endDate)
    }
    
    const transactions = await WalletTransaction.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
    
    const total = await WalletTransaction.countDocuments(query)
    
    res.json({
      success: true,
      data: transactions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// Get analytics
router.get('/analytics', auth, async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ user: req.user._id })
    
    if (!wallet) {
      return res.json({ success: true, data: {} })
    }
    
    // Get last 30 days stats
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    
    const dailyStats = await WalletTransaction.aggregate([
      { 
        $match: { 
          user: req.user._id,
          createdAt: { $gte: thirtyDaysAgo }
        } 
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          credit: { $sum: { $cond: [{ $eq: ['$direction', 'credit'] }, '$amount', 0] } },
          debit: { $sum: { $cond: [{ $eq: ['$direction', 'debit'] }, '$amount', 0] } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ])
    
    // Type breakdown
    const typeBreakdown = await WalletTransaction.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ])
    
    res.json({
      success: true,
      data: {
        summary: wallet.getAnalyticsSummary(),
        dailyStats,
        typeBreakdown
      }
    })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// Update payout settings
router.put('/payout-settings', auth, async (req, res) => {
  try {
    const wallet = await Wallet.getOrCreate(req.user._id)
    
    wallet.payoutSettings = {
      ...wallet.payoutSettings,
      ...req.body
    }
    
    await wallet.save()
    
    res.json({ success: true, data: wallet })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// Request payout
router.post('/payout', auth, async (req, res) => {
  try {
    const { amount, method } = req.body
    const wallet = await Wallet.findOne({ user: req.user._id })
    
    if (!wallet || wallet.balance < amount) {
      return res.status(400).json({ success: false, error: 'Insufficient balance' })
    }
    
    // Create payout request
    const Payout = mongoose.model('Payout')
    const payout = await Payout.create({
      user: req.user._id,
      amount,
      method,
      status: 'pending',
      address: wallet.payoutSettings.address
    })
    
    // Deduct from balance
    wallet.balance -= amount
    wallet.pendingBalance += amount
    await wallet.save()
    
    res.json({ success: true, data: payout })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

module.exports = router
