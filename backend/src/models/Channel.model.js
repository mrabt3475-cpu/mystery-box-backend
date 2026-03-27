// Channel & Bot Management System
// ==============================

const mongoose = require('mongoose')

// Channel Schema
const channelSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true, maxlength: 50 },
  description: { type: String, maxlength: 500 },
  username: { type: String, unique: true, sparse: true },
  avatar: { type: String },
  banner: { type: String },
  
  // Bot Configuration
  bot: {
    enabled: { type: Boolean, default: false },
    username: { type: String },
    token: { type: String }, // Encrypted
    apiKey: { type: String },
    commands: [{
      command: String,
      response: String,
      enabled: Boolean
    }],
    welcomeMessage: String,
    autoReply: Boolean
  },
  
  // Links to products
  products: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    position: Number,
    addedAt: Date
  }],
  
  // Promotion settings
  promotion: {
    isPromoted: { type: Boolean, default: false },
    promotedAt: Date,
    views: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 },
    conversions: { type: Number, default: 0 }
  },
  
  // Join settings
  joinSettings: {
    pointsRequired: { type: Number, default: 0 },
    isPrivate: { type: Boolean, default: false },
    requireApproval: { type: Boolean, default: false }
  },
  
  // Stats
  stats: {
    totalMembers: { type: Number, default: 0 },
    totalViews: { type: Number, default: 0 },
    totalClicks: { type: Number, default: 0 },
    totalSales: { type: Number, default: 0 },
    totalCommission: { type: Number, default: 0 },
    totalDonations: { type: Number, default: 0 }
  },
  
  // Commission settings
  commission: {
    rate: { type: Number, default: 10 }, // Percentage
    minPayout: { type: Number, default: 100 }
  },
  
  // Status
  status: { type: String, enum: ['active', 'suspended', 'archived'], default: 'active' },
  verified: { type: Boolean, default: false },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

channelSchema.index({ owner: 1 })
channelSchema.index({ 'stats.totalSales': -1 })

// Channel Member Schema
const channelMemberSchema = new mongoose.Schema({
  channel: { type: mongoose.Schema.Types.ObjectId, ref: 'Channel', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  role: { type: String, enum: ['owner', 'admin', 'moderator', 'member'], default: 'member' },
  
  // Stats for this member
  contributedSales: { type: Number, default: 0 },
  contributedViews: { type: Number, default: 0 },
  
  joinedAt: { type: Date, default: Date.now },
  lastActiveAt: { type: Date, default: Date.now }
})

channelMemberSchema.index({ channel: 1, user: 1 }, { unique: true })

// Channel Views Schema
const channelViewSchema = new mongoose.Schema({
  channel: { type: mongoose.Schema.Types.ObjectId, ref: 'Channel', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  ip: String,
  referrer: String,
  viewedAt: { type: Date, default: Date.now }
})

channelViewSchema.index({ channel: 1, viewedAt: -1 })

// Channel Service
class ChannelService {
  // Create channel
  async createChannel(userId, data) {
    const channel = await Channel.create({
      owner: userId,
      name: data.name,
      description: data.description,
      username: data.username,
      joinSettings: data.joinSettings || {}
    })
    
    // Add owner as member
    await ChannelMember.create({
      channel: channel._id,
      user: userId,
      role: 'owner'
    })
    
    return channel
  }
  
  // Setup bot for channel
  async setupBot(channelId, botConfig) {
    const channel = await Channel.findById(channelId)
    if (!channel) throw new Error('Channel not found')
    
    channel.bot = {
      enabled: true,
      username: botConfig.username,
      token: botConfig.token, // Should be encrypted
      commands: botConfig.commands || [],
      welcomeMessage: botConfig.welcomeMessage,
      autoReply: botConfig.autoReply || false
    }
    
    await channel.save()
    return channel
  }
  
  // Add product to channel
  async addProduct(channelId, productId, position = 0) {
    const channel = await Channel.findById(channelId)
    channel.products.push({ productId, position, addedAt: new Date() })
    await channel.save()
    return channel
  }
  
  // Join channel
  async joinChannel(channelId, userId, pointsBalance) {
    const channel = await Channel.findById(channelId)
    if (!channel) throw new Error('Channel not found')
    if (channel.status !== 'active') throw new Error('Channel is not active')
    
    // Check if already member
    const existingMember = await ChannelMember.findOne({
      channel: channelId,
      user: userId
    })
    if (existingMember) throw new Error('Already a member')
    
    // Check points required
    const pointsRequired = channel.joinSettings.pointsRequired
    if (pointsRequired > 0) {
      if (pointsBalance < pointsRequired) {
        throw new Error('Not enough points')
      }
    }
    
    // Create membership
    await ChannelMember.create({
      channel: channelId,
      user: userId,
      role: 'member'
    })
    
    // Update stats
    channel.stats.totalMembers += 1
    await channel.save()
    
    return { success: true, pointsSpent: pointsRequired }
  }
  
  // Leave channel
  async leaveChannel(channelId, userId) {
    const result = await ChannelMember.deleteOne({
      channel: channelId,
      user: userId,
      role: { $ne: 'owner' }
    })
    
    if (result.deletedCount > 0) {
      await Channel.findByIdAndUpdate(channelId, {
        $inc: { 'stats.totalMembers': -1 }
      })
    }
    
    return result
  }
  
  // Record view
  async recordView(channelId, userId, ip) {
    await ChannelView.create({
      channel: channelId,
      user: userId,
      ip
    })
    
    await Channel.findByIdAndUpdate(channelId, {
      $inc: {
        'stats.totalViews': 1,
        'promotion.views': 1
      }
    })
  }
  
  // Record conversion (sale)
  async recordConversion(channelId, userId, amount) {
    const channel = await Channel.findById(channelId)
    const commission = amount * (channel.commission.rate / 100)
    
    // Add commission to owner
    const owner = await mongoose.model('User').findById(channel.owner)
    owner.points += commission
    await owner.save()
    
    // Update stats
    channel.stats.totalSales += 1
    channel.stats.totalCommission += commission
    channel.promotion.conversions += 1
    await channel.save()
    
    return { commission, totalCommission: channel.stats.totalCommission }
  }
  
  // Donate to channel
  async donate(channelId, fromUserId, amount) {
    const channel = await Channel.findById(channelId)
    if (!channel) throw new Error('Channel not found')
    
    // Add to owner
    const owner = await mongoose.model('User').findById(channel.owner)
    owner.points += amount
    await owner.save()
    
    // Update stats
    channel.stats.totalDonations += amount
    await channel.save()
    
    return { donation: amount, totalDonations: channel.stats.totalDonations }
  }
  
  // Get channel analytics
  async getAnalytics(channelId, startDate, endDate) {
    const channel = await Channel.findById(channelId)
    const views = await ChannelView.find({
      channel: channelId,
      viewedAt: { $gte: startDate, $lte: endDate }
    })
    
    const uniqueViewers = await ChannelView.distinct('user', {
      channel: channelId,
      viewedAt: { $gte: startDate, $lte: endDate }
    })
    
    return {
      channel,
      views: views.length,
      uniqueViewers: uniqueViewers.length,
      viewsByDay: this.groupViewsByDay(views),
      stats: channel.stats,
      conversionRate: channel.stats.totalViews > 0 
        ? (channel.stats.totalSales / channel.stats.totalViews * 100).toFixed(2)
        : 0
    }
  }
  
  groupViewsByDay(views) {
    const grouped = {}
    views.forEach(view => {
      const day = view.viewedAt.toISOString().split('T')[0]
      grouped[day] = (grouped[day] || 0) + 1
    })
    return grouped
  }
  
  // Get trending channels
  async getTrending(limit = 10) {
    return Channel.find({ status: 'active' })
      .sort({ 'stats.totalSales': -1, 'stats.totalMembers': -1 })
      .limit(limit)
      .populate('owner', 'username avatar')
  }
}

const Channel = mongoose.model('Channel', channelSchema)
const ChannelMember = mongoose.model('ChannelMember', channelMemberSchema)
const ChannelView = mongoose.model('ChannelView', channelViewSchema)

module.exports = { 
  Channel, 
  ChannelMember, 
  ChannelView,
  ChannelService: new ChannelService() 
}
