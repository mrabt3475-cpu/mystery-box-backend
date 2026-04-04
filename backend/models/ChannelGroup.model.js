const mongoose = require('mongoose');

// نموذج القنوات والمجموعات مع التخصيصات المتقدمة
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

  // ========================
  // 🎨 تخصيص التصميم
  // ========================
  design: {
    // صورة الغلاف
    coverImage: { type: String, default: null },
    // فيديو الغلاف
    coverVideo: { type: String, default: null },
    // لون الخلفية
    backgroundColor: { type: String, default: '#0f172a' },
    // صورة الخلفية
    backgroundImage: { type: String, default: null },
    // تأثير الخلفية
    backgroundEffect: {
      type: String,
      enum: ['none', 'particles', 'gradient', 'stars', 'matrix', 'fire', 'snow'],
      default: 'none'
    },
    // لون النص
    textColor: { type: String, default: '#ffffff' },
    // لون النص الثانوي
    textMutedColor: { type: String, default: '#94a3b8' },
    // لون التمييز
    accentColor: { type: String, default: '#8b5cf6' },
    // الأيقونة
    icon: { type: String, default: null },
    // وصف مخصص
    customDescription: { type: String, default: null },
    // الشعار
    logo: { type: String, default: null },
    // حد الأيقونات
    borderRadius: { type: Number, default: 12 }
  },

  // ========================
  // 🎭 الشخصيات ثلاثية الأبعاد
  // ========================
  characters: {
    // تفعيل الشخصيات
    enabled: { type: Boolean, default: false },
    // الشخصية الرئيسية
    mainCharacter: {
      // نوع الشخصية
      type: {
        type: String,
        enum: ['robot', 'anime', 'human', 'animal', 'custom', 'none'],
        default: 'none'
      },
      // اسم الشخصية
      name: { type: String, default: null },
      // صورة/موشن الشخصية
      model3d: { type: String, default: null },  // GLB/GLTF
      image: { type: String, default: null },    // صورة ثابتة
      animation: { type: String, default: null }, // Rive animation
      // الإيماءات
      gestures: {
        wave: { type: String, default: null },    // تلويح
        dance: { type: String, default: null },   // رقص
        idle: { type: String, default: null },    // خمول
        celebrate: { type: String, default: null } // احتفال
      },
      // الألوان
      colors: {
        primary: { type: String, default: '#8b5cf6' },
        secondary: { type: String, default: '#3b82f6' },
        skin: { type: String, default: '#fcd34d' }
      },
      // الموضع
      position: {
        x: { type: Number, default: 50 },  // نسبة مئوية
        y: { type: Number, default: 50 },
        scale: { type: Number, default: 1 }
      },
      // إظهار في
      showOn: {
        header: { type: Boolean, default: true },
        welcome: { type: Boolean, default: true },
        wins: { type: Boolean, default: true },
        profile: { type: Boolean, default: false }
      }
    },
    // شخصية الترحيب
    welcomeCharacter: {
      type: { type: String, enum: ['robot', 'anime', 'human', 'animal', 'custom', 'none'], default: 'none' },
      image: { type: String, default: null },
      animation: { type: String, default: null },
      message: { type: String, default: 'مرحباً بك!' }
    }
  },

  // ========================
  // ✨ التأثيرات والأنميشن
  // ========================
  animations: {
    // تفعيل الأنميشن
    enabled: { type: Boolean, default: true },
    // نوع الأنميشن العام
    globalAnimation: {
      type: String,
      enum: ['none', 'fade', 'slide', 'bounce', 'pulse', 'shake', 'float'],
      default: 'fade'
    },
    // سرعة الأنميشن (مللي ثانية)
    animationSpeed: { type: Number, default: 300 },
    // أنميشن فتح الصندوق
    boxOpenAnimation: {
      type: String,
      enum: ['default', 'shake', 'spin', 'explode', 'glow', 'flip', 'zoom'],
      default: 'default'
    },
    // أنميشن الفوز
    winAnimation: {
      type: String,
      enum: ['default', 'confetti', 'fireworks', 'glow', 'pulse', 'bounce'],
      default: 'default'
    },
    // أنميشن الانتقال
    transitionAnimation: {
      type: String,
      enum: ['none', 'fade', 'slide-left', 'slide-right', 'zoom', 'flip'],
      default: 'fade'
    },
    // تأثيرات خاصة
    specialEffects: {
      particles: { type: Boolean, default: true },
      glow: { type: Boolean, default: true },
      shadows: { type: Boolean, default: true },
      blur: { type: Boolean, default: false }
    },
    // أنميشن العناصر
    elementAnimations: {
      buttons: {
        hover: { type: String, default: 'scale' },
        click: { type: String, default: 'pulse' }
      },
      cards: {
        hover: { type: String, default: 'lift' },
        appear: { type: String, default: 'fade-up' }
      },
      images: {
        hover: { type: String, default: 'zoom' },
        appear: { type: String, default: 'fade' }
      }
    }
  },

  // ========================
  // 🖼️ الوسائط
  // ========================
  media: {
    // صور الندرة
    rarityImages: {
      common: { type: String, default: null },
      uncommon: { type: String, default: null },
      rare: { type: String, default: null },
      epic: { type: String, default: null },
      legendary: { type: String, default: null },
      mythic: { type: String, default: null }
    },
    // صور الحالة
    statusImages: {
      online: { type: String, default: null },
      offline: { type: String, default: null },
      busy: { type: String, default: null }
    },
    // المؤثرات الصوتية
    sounds: {
      boxOpen: { type: String, default: null },
      win: { type: String, default: null },
      levelUp: { type: String, default: null },
      notification: { type: String, default: null }
    },
    // تفعيل الصوت
    soundEnabled: { type: Boolean, default: true },
    مستوى الصوت: { type: Number, default: 50 }
  },

  // ========================
  // 👤 واجهة المستخدم
  // ========================
  ui: {
    // شكل البطاقات
    cardStyle: {
      type: String,
      enum: ['default', 'glass', 'gradient', 'solid', 'outline'],
      default: 'default'
    },
    // شكل الأزرار
    buttonStyle: {
      type: String,
      enum: ['default', 'rounded', 'pill', 'outline', 'soft'],
      default: 'rounded'
    },
    // شكل الصناديق
    boxStyle: {
      type: String,
      enum: ['default', '3d', 'animated', 'minimal', 'realistic'],
      default: 'default'
    },
    // شكل الإشعارات
    notificationStyle: {
      type: String,
      enum: ['default', 'toast', 'banner', 'modal', 'floating'],
      default: 'toast'
    },
    // شكل الملف الشخصي
    profileStyle: {
      type: String,
      enum: ['default', 'card', 'minimal', 'detailed'],
      default: 'default'
    },
    // إظهار العناصر
    showElements: {
      leaderboard: { type: Boolean, default: true },
      statistics: { type: Boolean, default: true },
      achievements: { type: Boolean, default: true },
      history: { type: Boolean, default: true },
      chat: { type: Boolean, default: true }
    }
  },

  // ========================
  // 🔤 النصوص والرسائل
  // ========================
  messages: {
    // رسالة الترحيب
    welcome: {
      enabled: { type: Boolean, default: true },
      title: { type: String, default: 'مرحباً بك!' },
      message: { type: String, default: 'نحن سعيدون بانضمامك إلينا' },
      image: { type: String, default: null },
      sticker: { type: String, default: null },
      buttons: [{ type: String }]
    },
    // رسالة الفوز
    winMessage: {
      enabled: { type: Boolean, default: true },
      template: { type: String, default: '🎉 تهانينا! فزت بـ {prize}!' },
      showInChannel: { type: Boolean, default: true },
      announceChannel: { type: String, default: null }
    },
    // رسالة المستوى
    levelUp: {
      enabled: { type: Boolean, default: true },
      message: { type: String, default: '🎊 وصلت للمستوى {level}!' }
    },
    // رسائل مخصصة
    customMessages: {
      type: Map,
      of: String
    }
  },

  // ========================
  // ⚙️ إعدادات الأدوار
  // ========================
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

  // ========================
  // 🔒 إعدادات الأمان
  // ========================
  security: {
    requireVerification: { type: Boolean, default: false },
    minLevel: { type: Number, default: 1 },
    minPoints: { type: Number, default: 0 },
    requireReferrals: { type: Boolean, default: false },
    minReferrals: { type: Number, default: 0 },
    banWords: [{ type: String }],
    maxWarnings: { type: Number, default: 3 }
  },

  // ========================
  // 🎁 إعدادات المكافآت
  // ========================
  rewards: {
    pointsPerMessage: { type: Number, default: 0 },
    pointsPerDay: { type: Number, default: 0 },
    bonusForInvites: { type: Number, default: 0 },
    weeklyBonus: { type: Number, default: 0 },
    bonusForWins: { type: Number, default: 0 }
  },

  // ========================
  // 🔔 إعدادات الإشعارات
  // ========================
  notifications: {
    welcomeMessage: { type: Boolean, default: true },
    notifyOnWin: { type: Boolean, default: true },
    notifyOnLevelUp: { type: Boolean, default: true },
    notifyOnAchievement: { type: Boolean, default: true },
    broadcastWins: { type: Boolean, default: false }
  },

  // ========================
  // 🤖 إعدادات البوت
  // ========================
  bot: {
    botUsername: { type: String, default: null },
    botToken: { type: String, default: null },
    autoKickAfter: { type: Number, default: 0 },
    deleteCommands: { type: Boolean, default: true },
    pinWinners: { type: Boolean, default: false },
    welcomeSticker: { type: String, default: null }
  },

  // ========================
  // 📊 الحالة
  // ========================
  status: {
    type: String,
    enum: ['active', 'inactive', 'banned'],
    default: 'active'
  },
  isVerified: {
    type: Boolean,
    default: false
  },

  // ========================
  // 📈 الإحصائيات
  // ========================
  stats: {
    membersCount: { type: Number, default: 0 },
    messagesCount: { type: Number, default: 0 },
    winsAnnounced: { type: Number, default: 0 },
    totalPointsDistributed: { type: Number, default: 0 }
  },

  // ========================
  // 👑 المالك والمشرفون
  // ========================
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  moderators: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    addedAt: { type: Date, default: Date.now },
    permissions: [{
      type: String,
      enum: ['manage_members', 'manage_messages', 'post_messages', 'edit_settings', 'manage_design']
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