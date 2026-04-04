const mongoose = require('mongoose');

// إعدادات المنصة الرئيسية
const settingsSchema = new mongoose.Schema({
  // إعدادات عامة
  general: {
    siteName: { type: String, default: 'PuzzleChain' },
    siteNameAr: { type: String, default: 'بازل تشين' },
    siteDescription: { type: String, default: 'منصة صناديق الغموض' },
    siteDescriptionAr: { type: String, default: 'منصة صناديق الغموض' },
    logo: { type: String, default: null },
    favicon: { type: String, default: null },
    language: { type: String, default: 'ar' },
    timezone: { type: String, default: 'Asia/Riyadh' },
    currency: { type: String, default: 'SAR' },
    currencySymbol: { type: String, default: '﷼' }
  },

  // إعدادات التصميم
  design: {
    primaryColor: { type: String, default: '#8b5cf6' },
    secondaryColor: { type: String, default: '#3b82f6' },
    accentColor: { type: String, default: '#f59e0b' },
    backgroundColor: { type: String, default: '#0f172a' },
    surfaceColor: { type: String, default: '#1e293b' },
    textColor: { type: String, default: '#f8fafc' },
    textMutedColor: { type: String, default: '#94a3b8' },
    successColor: { type: String, default: '#22c55e' },
    errorColor: { type: String, default: '#ef4444' },
    warningColor: { type: String, default: '#f59e0b' },
    borderRadius: { type: Number, default: 12 },
    fontFamily: { type: String, default: 'Cairo, sans-serif' },
    darkMode: { type: Boolean, default: true }
  },

  // إعدادات المجموعات والقنوات
  groups: {
    mainChannel: { type: String, default: null },      // قناة الرئيسية
    supportGroup: { type: String, default: null },     // مجموعة الدعم
    rulesChannel: { type: String, default: null },     // قناة القواعد
    winnersChannel: { type: String, default: null },   // قناة الفائزين
    announcementsChannel: { type: String, default: null }, // قناة الإعلانات
    
    // إعدادات الأوامر
    enableCommands: { type: Boolean, default: true },
    botCommands: {
      start: { type: String, default: 'start' },
      help: { type: String, default: 'help' },
      balance: { type: String, default: 'balance' },
      boxes: { type: String, default: 'boxes' },
      profile: { type: String, default: 'profile' },
      referral: { type: String, default: 'referral' }
    },

    // رسائل الترحيب
    welcomeMessage: { type: String, default: 'مرحباً بك! 🎉' },
    welcomeMessageAr: { type: String, default: 'مرحباً بك! 🎉' },
    welcomeSticker: { type: String, default: null },
    welcomePhoto: { type: String, default: null },

    // رسائل الإشعار
    notifyOnBoxOpen: { type: Boolean, default: true },
    notifyOnGift: { type: Boolean, default: true },
    notifyOnOrder: { type: Boolean, default: true },
    notifyOnWin: { type: Boolean, default: true },
    notifyOnLevelUp: { type: Boolean, default: true }
  },

  // إعدادات المستخدم
  userSettings: {
    requirePhone: { type: Boolean, default: false },
    requireEmail: { type: Boolean, default: false },
    allowReferrals: { type: Boolean, default: true },
    referralBonus: { type: Number, default: 100 },
    referredUserBonus: { type: Number, default: 50 },
    minAge: { type: Number, default: 18 },
    allowMultipleAccounts: { type: Boolean, default: false },
    
    // حدود الاستخدام
    maxBoxesPerDay: { type: Number, default: 50 },
    maxGiftPerDay: { type: Number, default: 10 },
    maxPointsPerGift: { type: Number, default: 10000 },
    minPointsForGift: { type: Number, default: 10 },
    
    // ملفات المستخدمين
    showLeaderboard: { type: Boolean, default: true },
    showStats: { type: Boolean, default: true },
    showHistory: { type: Boolean, default: true }
  },

  // إعدادات الأمان
  security: {
    enable2FA: { type: Boolean, default: false },
    requireEmailVerification: { type: Boolean, default: false },
    requirePhoneVerification: { type: Boolean, default: false },
    maxLoginAttempts: { type: Number, default: 5 },
    sessionTimeout: { type: Number, default: 86400 }, // 24 ساعة
    enableCaptcha: { type: Boolean, default: false }
  },

  // إعدادات الدفع
  payment: {
    enableTON: { type: Boolean, default: true },
    enableStripe: { type: Boolean, default: true },
    enableWalletConnect: { type: Boolean, default: true },
    minDeposit: { type: Number, default: 10 },
    maxDeposit: { type: Number, default: 10000 },
    minWithdraw: { type: Number, default: 100 },
    withdrawFee: { type: Number, default: 2 } // نسبة مئوية
  },

  // إعدادات البريد
  email: {
    fromName: { type: String, default: 'PuzzleChain' },
    fromEmail: { type: String, default: 'noreply@puzzlechain.com' },
    sendWelcomeEmail: { type: Boolean, default: false },
    sendOrderConfirmation: { type: Boolean, default: false }
  },

  // إعدادات الصيانة
  maintenance: {
    enabled: { type: Boolean, default: false },
    message: { type: String, default: 'الموقع قيد الصيانة' },
    messageAr: { type: String, default: 'الموقع قيد الصيانة' },
    allowedIPs: [{ type: String }]
  },

  // الإعدادات الاجتماعية
  social: {
    telegram: { type: String, default: null },
    twitter: { type: String, default: null },
    instagram: { type: String, default: null },
    discord: { type: String, default: null },
    youtube: { type: String, default: null }
  },

  // إعدادات API
  api: {
    enableAPI: { type: Boolean, default: true },
    defaultRateLimit: { type: Number, default: 100 },
    enableWebhooks: { type: Boolean, default: true },
    webhookSecret: { type: String, default: null }
  },

  // آخر تحديث
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Singleton - الحصول على الإعدادات
settingsSchema.statics.getSettings = async function() {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

// تحديث الإعدادات
settingsSchema.statics.updateSettings = async function(data, userId) {
  const settings = await this.findOne();
  if (!settings) {
    return this.create({ ...data, updatedBy: userId });
  }
  
  Object.assign(settings, data);
  settings.updatedBy = userId;
  await settings.save();
  return settings;
};

module.exports = mongoose.model('Settings', settingsSchema);