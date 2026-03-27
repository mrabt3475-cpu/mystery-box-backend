// Private Group System
// ====================

const mongoose = require('mongoose')

const groupSchema = new mongoose.Schema({
  channel: { type: mongoose.Schema.Types.ObjectId, ref: 'Channel', required: true },
  name: { type: String, required: true, maxlength: 100 },
  description: { type: String, maxlength: 500 },
  inviteLink: { type: String, unique: true },
  
  // Privacy settings
  privacy: {
    isPrivate: { type: Boolean, default: true },
    joinMode: { 
      type: String, 
      enum: ['free', 'points', 'approval', 'invite'], 
      default: 'points' 
    },
    pointsRequired: { type: Number, default: 10 }
  },
  
  // Member management
  members: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    role: { type: String, enum: ['owner', 'admin', 'moderator', 'member'], default: 'member' },
    joinedAt: { type: Date, default: Date.now }
  }],
  
  // Settings
  settings: {
    allowMessages: { type: Boolean, default: true },
    allowMedia: { type: Boolean, default: true },
    maxMembers: { type: Number, default: 500 },
    requireApproval: { type: Boolean, default: false }
  },
  
  // Stats
  stats: {
    totalMembers: { type: Number, default: 0 },
    totalMessages: { type: Number, default: 0 },
    activeToday: { type: Number, default: 0 }
  },
  
  createdAt: { type: Date, default: Date.now }
})

// Generate invite link
groupSchema.methods.generateInviteLink = function() {
  const crypto = require('crypto')
  this.inviteLink = crypto.randomBytes(8).toString('hex')
  return this.inviteLink
}

// Join group
groupSchema.methods.addMember = async function(userId, userPoints) {
  // Check if already member
  if (this.members.some(m => m.user.toString() === userId.toString())) {
    throw new Error('Already a member')
  }
  
  // Check max members
  if (this.members.length >= this.settings.maxMembers) {
    throw new Error('Group is full')
  }
  
  // Check join mode
  if (this.privacy.joinMode === 'points') {
    if (userPoints < this.privacy.pointsRequired) {
      throw new Error('Not enough points')
    }
    return { requirePoints: this.privacy.pointsRequired, action: 'deduct' }
  }
  
  if (this.privacy.joinMode === 'approval') {
    return { requireApproval: true }
  }
  
  // Add member
  this.members.push({ user: userId, role: 'member' })
  this.stats.totalMembers = this.members.length
  await this.save()
  
  return { success: true }
}

// Remove member
groupSchema.methods.removeMember = async function(userId) {
  const initialLength = this.members.length
  this.members = this.members.filter(m => m.user.toString() !== userId.toString())
  
  if (this.members.length < initialLength) {
    this.stats.totalMembers = this.members.length
    await this.save()
    return true
  }
  
  return false
}

// Check if user is admin
groupSchema.methods.isAdmin = function(userId) {
  const member = this.members.find(m => m.user.toString() === userId.toString())
  return member && ['owner', 'admin', 'moderator'].includes(member.role)
}

const Group = mongoose.model('Group', groupSchema)

module.exports = Group
