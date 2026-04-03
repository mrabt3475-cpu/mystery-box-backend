import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  // المستخدم المالك
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // نوع الخدمة
  serviceType: {
    type: String,
    enum: ['group', 'channel', 'bot'],
    required: true
  },
  // الاسم والوصف
  name: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  description: String,
  
  // الإعدادات
  settings: {
    // إعدادات عامة
    isPrivate: { type: Boolean, default: false },
    requireApproval: { type: Boolean, default: false },
    maxMembers: Number,
    
    // إعدادات الأمان
    password: String,
    inviteLink: String,
    
    // المظهر
    color: { type: String, default: '#6366f1' },
    icon: String,
    banner: String
  },
  
  // إعدادات البوت (إذا كان serviceType = 'bot')
  botSettings: {
    isActive: { type: Boolean, default: true },
    botCommands: [String],
    autoReply: { type: Boolean, default: false },
    autoReplyMessages: mongoose.Schema.Types.Mixed,
    welcomeMessage: String,
    farewellMessage: String,
    spamFilter: { type: Boolean, default: false },
    maxSpamCount: { type: Number, default: 3 },
    muteDuration: { type: Number, default: 60 },
    // ألعاب البوت
    enableGames: { type: Boolean, default: false },
    enablePoints: { type: Boolean, default: false },
    pointsPerMessage: { type: Number, default: 1 },
    // ردود الأفعال التلقائية
    autoReact: { type: Boolean, default: false },
    reactEmojis: [String],
    // الأوامر المخصصة
    customCommands: mongoose.Schema.Types.Mixed
  },
  
  // إعدادات القناة (إذا كان serviceType = 'channel')
  channelSettings: {
    isPublic: { type: Boolean, default: true },
    allowComments: { type: Boolean, default: true },
    allowReactions: { type: Boolean, default: true },
    requireApproval: { type: Boolean, default: false },
    maxPostsPerDay: { type: Number, default: 100 },
    // التبرعات
    enableDonations: { type: Boolean, default: false },
    donationMessage: String,
    // الإشعارات
    notifyOnJoin: { type: Boolean, default: true },
    notifyOnPost: { type: Boolean, default: true }
  },
  
  // إعدادات المجموعة (إذا كان serviceType = 'group')
  groupSettings: {
    isPublic: { type: Boolean, default: true },
    allowInvites: { type: Boolean, default: true },
    allowMedia: { type: Boolean, default: true },
    allowStickers: { type: Boolean, default: true },
    maxMembers: { type: Number, default: 5000 },
    // الأدوار
    defaultRole: { type: String, default: 'member' },
    // قواعد
    rules: [String],
    // الترحيب
    welcomeMessage: String,
    autoWelcome: { type: Boolean, default: true }
  },
  
  // الحالة
  status: {
    type: String,
    enum: ['active', 'suspended', 'deleted', 'expired'],
    default: 'active'
  },
  
  // نقاط التكلفة
  pointsCost: {
    type: Number,
    default: 0
  },
  
  // مدة الاشتراك
  duration: {
    type: Number, // بالأيام
    default: 30
  },
  expiresAt: Date,
  
  // الأعضاء/المشتركين
  members: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    role: { type: String, enum: ['owner', 'admin', 'moderator', 'member'], default: 'member' },
    joinedAt: { type: Date, default: Date.now },
    lastActive: Date
  }],
  
  //统计
  stats: {
    views: { type: Number, default: 0 },
    posts: { type: Number, default: 0 },
    messages: { type: Number, default: 0 },
    reactions: { type: Number, default: 0 }
  },
  
  // منشئ الخدمة
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Index
serviceSchema.index({ owner: 1 });
serviceSchema.index({ serviceType: 1 });
serviceSchema.index({ slug: 1 });
serviceSchema.index({ status: 1 });

// Pre-save
serviceSchema.pre('save', function(next) {
  if (!this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') + '-' + Date.now().toString(36);
  }
  this.updatedAt = new Date();
  next();
});

export default mongoose.model('Service', serviceSchema);
