const mongoose = require('mongoose');

// نموذج القنوات والمجموعات
const channelGroupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['channel', 'group', 'supergroup'],
    required: true
  },
  chatId: {
    type: String,
    required: true,
    unique: true
  },
  username: {
    type: String,
    trim: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    trim: true
  },
  inviteLink: {
    type: String,
    trim: true
  },
  
  // إعدادات التصميم
  design: {
    // صورة الغلاف
    coverImage: { type: String, default: null },
    // لون الخلفية
    backgroundColor: { type: String, default: '#0f172a' },
    // لون النص
    textColor: { type: String, default: '#ffffff' },
    // الأيقونة
    icon: { type: String, default: null },
    // وصف مخصص
    customDescription: { type: String, default: null }
  },

  // إعدادات الأدوار
  roles: {
    // من يمكنه الإرسال
    allowPosting: {
      type: String,
      enum: ['everyone', 'admins', 'moderators', 'specific'],
      default: 'admins'
    },
    // الأدوار المسموح بها
    allowedRoles: [{
      type: String,
      enum: ['user', 'vip', 'moderator', 'admin', 'owner']
    }]
  },

  // إعدادات الأمان
  security: {
    requireVerification: { type: Boolean, default: false },
    minLevel: { type: Number, default: 1 },
    minPoints: { type: Number, default: 0 },
    requireReferrals: { type: Boolean, default: false },
    minReferrals: { type: Number, default: 0 },
    banWords: [{ type: String }],
    maxWarnings: { type: Number, default: 3 }
  },

  // إعدادات المكافآت
  rewards: {
    pointsPerMessage: { type: Number, default: 0 },
    pointsPerDay: { type: Number, default: 0 },
    bonusForInvites: { type: Number, default: 0 },
    weeklyBonus: { type: Number, default: 0 }
  },

  // إعدادات الإشعارات
  notifications: {
    welcomeMessage: { type: Boolean, default: true },
    welcomeText: { type: String, default: 'مرحباً بك!' },
    notifyOnWin: { type: Boolean, default: true },
    notifyOnLevelUp: { type: Boolean, default: true },
    notifyOnAchievement: { type: Boolean, default: true },
    broadcastWins: { type: Boolean, default: false }
  },

  // إعدادات البوت
  bot: {
    botUsername: { type: String, default: null },
    botToken: { type: String, default: null },
    autoKickAfter: { type: Number, default: 0 }, // أيام
    deleteCommands: { type: Boolean, default: true },
    pinWinners: { type: Boolean, default: false },
    welcomeSticker: { type: String, default: null }
  },

  // الحالة
  status: {
    type: String,
    enum: ['active', 'inactive', 'banned'],
    default: 'active'
  },

  // إحصائيات
  stats: {
    membersCount: { type: Number, default: 0 },
    messagesCount: { type: Number, default: 0 },
    winsAnnounced: { type: Number, default: 0 }
  },

  // مالك المجموعة
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // المشرفون
  moderators: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    addedAt: { type: Date, default: Date.now },
    permissions: [{
      type: String,
      enum: ['manage_members', 'manage_messages', 'post_messages', 'edit_settings']
    }]
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for members count
channelGroupSchema.virtual('memberCount').get(function() {
  return this.stats?.membersCount || 0;
});

// Index
channelGroupSchema.index({ chatId: 1 });
channelGroupSchema.index({ owner: 1 });
channelGroupSchema.index({ status: 1 });

module.exports = mongoose.model('ChannelGroup', channelGroupSchema);