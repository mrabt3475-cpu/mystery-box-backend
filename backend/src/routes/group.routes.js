// API Routes for Groups
// =====================

const express = require('express')
const router = express.Router()
const Group = require('../models/Group.model')
const { Channel, ChannelService } = require('../models/Channel.model')
const { Wallet } = require('../models/Wallet.model')
const { auth } = require('../middleware/auth.middleware')

// Get groups for user's channels
router.get('/my', auth, async (req, res) => {
  try {
    const channels = await Channel.find({ owner: req.user._id })
    const channelIds = channels.map(c => c._id)
    
    const groups = await Group.find({ channel: { $in: channelIds } })
      .populate('channel', 'name')
    
    res.json({ success: true, data: groups })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// Create group for channel
router.post('/', auth, async (req, res) => {
  try {
    const { channelId, name, description, privacy } = req.body
    
    const channel = await Channel.findOne({ _id: channelId, owner: req.user._id })
    if (!channel) {
      return res.status(404).json({ success: false, error: 'Channel not found' })
    }
    
    const group = await Group.create({
      channel: channelId,
      name,
      description,
      privacy: privacy || {},
      members: [{ user: req.user._id, role: 'owner' }]
    })
    
    group.generateInviteLink()
    await group.save()
    
    res.json({ success: true, data: group })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// Get group by invite link
router.get('/join/:inviteLink', async (req, res) => {
  try {
    const group = await Group.findOne({ inviteLink: req.params.inviteLink })
      .populate('channel', 'name description')
    
    if (!group) {
      return res.status(404).json({ success: false, error: 'Group not found' })
    }
    
    res.json({ success: true, data: group })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// Join group via invite
router.post('/join/:inviteLink', auth, async (req, res) => {
  try {
    const group = await Group.findOne({ inviteLink: req.params.inviteLink })
      .populate('channel')
    
    if (!group) {
      return res.status(404).json({ success: false, error: 'Group not found' })
    }
    
    const wallet = await Wallet.findOne({ user: req.user._id })
    
    const result = await group.addMember(req.user._id, wallet?.balance || 0)
    
    if (result.requirePoints) {
      await wallet.deductPoints(result.requirePoints, 'channel_join', `Joined group: ${group.name}`)
    }
    
    res.json({ success: true, data: result })
  } catch (error) {
    res.status(400).json({ success: false, error: error.message })
  }
})

// Leave group
router.post('/:id/leave', auth, async (req, res) => {
  try {
    const group = await Group.findById(req.params.id)
    
    if (!group) {
      return res.status(404).json({ success: false, error: 'Group not found' })
    }
    
    await group.removeMember(req.user._id)
    
    res.json({ success: true, message: 'Left group successfully' })
  } catch (error) {
    res.status(400).json({ success: false, error: error.message })
  }
})

// Update group settings
router.put('/:id', auth, async (req, res) => {
  try {
    const group = await Group.findById(req.params.id)
    
    if (!group) {
      return res.status(404).json({ success: false, error: 'Group not found' })
    }
    
    // Check ownership
    const channel = await Channel.findById(group.channel)
    if (channel.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, error: 'Not authorized' })
    }
    
    Object.assign(group, req.body)
    await group.save()
    
    res.json({ success: true, data: group })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// Get group members
router.get('/:id/members', auth, async (req, res) => {
  try {
    const group = await Group.findById(req.params.id)
      .populate('members.user', 'username avatar')
    
    if (!group) {
      return res.status(404).json({ success: false, error: 'Group not found' })
    }
    
    res.json({ success: true, data: group.members })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// Remove member (admin only)
router.delete('/:id/members/:userId', auth, async (req, res) => {
  try {
    const group = await Group.findById(req.params.id)
    
    if (!group) {
      return res.status(404).json({ success: false, error: 'Group not found' })
    }
    
    if (!group.isAdmin(req.user._id)) {
      return res.status(403).json({ success: false, error: 'Not authorized' })
    }
    
    await group.removeMember(req.params.userId)
    
    res.json({ success: true, message: 'Member removed' })
  } catch (error) {
    res.status(400).json({ success: false, error: error.message })
  }
})

module.exports = router
