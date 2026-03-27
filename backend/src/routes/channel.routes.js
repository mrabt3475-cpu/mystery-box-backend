// API Routes for Channels
// ======================

const express = require('express')
const router = express.Router()
const { Channel, ChannelMember, ChannelService } = require('../models/Channel.model')
const { Wallet } = require('../models/Wallet.model')
const { auth } = require('../middleware/auth.middleware')
const { body, validationResult } = require('express-validator')

// Get all channels
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20, search, category, sort } = req.query
    
    const query = { status: 'active' }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ]
    }
    
    const channels = await Channel.find(query)
      .populate('owner', 'username avatar')
      .sort(sort === 'popular' ? { 'stats.totalSales': -1 } : { createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
    
    const total = await Channel.countDocuments(query)
    
    res.json({
      success: true,
      data: channels,
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

// Get my channels
router.get('/my', auth, async (req, res) => {
  try {
    const channels = await Channel.find({ owner: req.user._id })
      .populate('products.productId')
    
    res.json({ success: true, data: channels })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// Create channel
router.post('/', auth, [
  body('name').notEmpty().withMessage('Channel name is required'),
  body('name').isLength({ max: 50 }),
  body('username').optional().isLength({ min: 3, max: 30 })
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() })
    }
    
    const channel = await ChannelService.createChannel(req.user._id, req.body)
    
    res.json({ success: true, data: channel })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// Get channel by ID
router.get('/:id', async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id)
      .populate('owner', 'username avatar')
      .populate('products.productId')
    
    if (!channel) {
      return res.status(404).json({ success: false, error: 'Channel not found' })
    }
    
    // Record view
    await ChannelService.recordView(channel._id, req.user?._id, req.ip)
    
    res.json({ success: true, data: channel })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// Update channel
router.put('/:id', auth, async (req, res) => {
  try {
    const channel = await Channel.findOne({ _id: req.params.id, owner: req.user._id })
    
    if (!channel) {
      return res.status(404).json({ success: false, error: 'Channel not found' })
    }
    
    Object.assign(channel, req.body)
    channel.updatedAt = new Date()
    await channel.save()
    
    res.json({ success: true, data: channel })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// Setup bot
router.post('/:id/bot', auth, async (req, res) => {
  try {
    const channel = await Channel.findOne({ _id: req.params.id, owner: req.user._id })
    
    if (!channel) {
      return res.status(404).json({ success: false, error: 'Channel not found' })
    }
    
    const updated = await ChannelService.setupBot(channel._id, req.body)
    
    res.json({ success: true, data: updated })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// Add product to channel
router.post('/:id/products', auth, async (req, res) => {
  try {
    const channel = await Channel.findOne({ _id: req.params.id, owner: req.user._id })
    
    if (!channel) {
      return res.status(404).json({ success: false, error: 'Channel not found' })
    }
    
    const updated = await ChannelService.addProduct(channel._id, req.body.productId, req.body.position)
    
    res.json({ success: true, data: updated })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// Join channel
router.post('/:id/join', auth, async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ user: req.user._id })
    const channel = await Channel.findById(req.params.id)
    
    if (!channel) {
      return res.status(404).json({ success: false, error: 'Channel not found' })
    }
    
    const result = await ChannelService.joinChannel(
      channel._id, 
      req.user._id, 
      wallet?.balance || 0
    )
    
    // Deduct points if required
    if (result.pointsSpent > 0) {
      await wallet.deductPoints(result.pointsSpent, 'channel_join', `Joined channel: ${channel.name}`)
    }
    
    res.json({ success: true, data: result })
  } catch (error) {
    res.status(400).json({ success: false, error: error.message })
  }
})

// Leave channel
router.post('/:id/leave', auth, async (req, res) => {
  try {
    await ChannelService.leaveChannel(req.params.id, req.user._id)
    
    res.json({ success: true, message: 'Left channel successfully' })
  } catch (error) {
    res.status(400).json({ success: false, error: error.message })
  }
})

// Donate to channel
router.post('/:id/donate', auth, async (req, res) => {
  try {
    const { amount } = req.body
    const channel = await Channel.findById(req.params.id)
    
    if (!channel) {
      return res.status(404).json({ success: false, error: 'Channel not found' })
    }
    
    const wallet = await Wallet.findOne({ user: req.user._id })
    if (!wallet || wallet.balance < amount) {
      return res.status(400).json({ success: false, error: 'Insufficient balance' })
    }
    
    // Deduct from sender
    await wallet.deductPoints(amount, 'donation_sent', `Donated to: ${channel.name}`)
    
    // Add to channel owner
    const result = await ChannelService.donate(channel._id, req.user._id, amount)
    
    res.json({ success: true, data: result })
  } catch (error) {
    res.status(400).json({ success: false, error: error.message })
  }
})

// Get channel analytics
router.get('/:id/analytics', auth, async (req, res) => {
  try {
    const channel = await Channel.findOne({ _id: req.params.id, owner: req.user._id })
    
    if (!channel) {
      return res.status(404).json({ success: false, error: 'Channel not found' })
    }
    
    const startDate = new Date(req.query.startDate || Date.now() - 30 * 24 * 60 * 60 * 1000)
    const endDate = new Date(req.query.endDate || Date.now())
    
    const analytics = await ChannelService.getAnalytics(channel._id, startDate, endDate)
    
    res.json({ success: true, data: analytics })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// Get trending channels
router.get('/trending/popular', async (req, res) => {
  try {
    const channels = await ChannelService.getTrending(10)
    
    res.json({ success: true, data: channels })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

module.exports = router
