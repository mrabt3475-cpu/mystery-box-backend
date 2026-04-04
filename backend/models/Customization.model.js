const mongoose = require('mongoose');

// نموذج تخصيص واجهة المستخدم
const customizationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['theme', 'persona', 'template'],
    required: true
  },
  target: {
    type: String,
    enum: ['admin', 'user', 'both'],
    default: 'both'
  },
  
  // الألوان
  colors: {
    primary: { type: String, default: '#8b5cf6' },
    primaryHover: { type: String, default: '#7c3aed' },
    secondary: { type: String, default: '#3b82f6' },
    accent: { type: String, default: '#f59e0b' },
    background: { type: String, default: '#0f172a' },
    surface: { type: String, default: '#1e293b' },
    surfaceHover: { type: String, default: '#334155' },
    text: { type: String, default: '#f8fafc' },
    textMuted: { type: String, default: '#94a3b8' },
    border: { type: String, default: '#334155' },
    success: { type: String, default: '#22c55e' },
    error: { type: String, default: '#ef4444' },
    warning: { type: String, default: '#f59e0b' },
    info: { type: String, default: '#3b82f6' }
  },

  // ألوان الندرة
  rarityColors: {
    common: { type: String, default: '#9ca3af' },
    uncommon: { type: String, default: '#22c55e' },
    rare: { type: String, default: '#3b82f6' },
    epic: { type: String, default: '#a855f7' },
    legendary: { type: String, default: '#f59e0b' },
    mythic: { type: String, default: '#ef4444' }
  },

  // الخطوط
  fonts: {
    primary: { type: String, default: 'Cairo' },
    secondary: { type: String, default: 'Inter' },
    sizes: {
      xs: { type: String, default: '0.75rem' },
      sm: { type: String, default: '0.875rem' },
      base: { type: String, default: '1rem' },
      lg: { type: String, default: '1.125rem' },
      xl: { type: String, default: '1.25rem' },
      '2xl': { type: String, default: '1.5rem' },
      '3xl': { type: String, default: '1.875rem' },
      '4xl': { type: String, default: '2.25rem' }
    }
  },

  // التصميم
  design: {
    borderRadius: { type: Number, default: 12 },
    borderRadiusSm: { type: Number, default: 8 },
    borderRadiusLg: { type: Number, default: 16 },
    shadow: { type: String, default: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' },
    shadowLg: { type: String, default: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' },
    animation: {
      type: String,
      enum: ['none', 'fade', 'slide', 'zoom', 'bounce'],
      default: 'fade'
    },
    animationDuration: { type: Number, default: 300 }
  },

  // العناصر المخصصة
  elements: {
    // شكل البطاقات
    cardStyle: {
      type: String,
      enum: ['default', 'glass', 'gradient', 'solid'],
      default: 'default'
    },
    // شكل الأزرار
    buttonStyle: {
      type: String,
      enum: ['default', 'rounded', 'pill', 'outline'],
      default: 'rounded'
    },
    // شكل الصناديق
    boxStyle: {
      type: String,
      enum: ['default', '3d', 'animated', 'minimal'],
      default: 'default'
    },
    // تأثير فتح الصندوق
    openAnimation: {
      type: String,
      enum: ['default', 'shake', 'spin', 'explode', 'glow'],
      default: 'default'
    },
    // شكل الإشعارات
    notificationStyle: {
      type: String,
      enum: ['default', 'toast', 'banner', 'modal'],
      default: 'toast'
    }
  },

  // الصور
  images: {
    logo: { type: String, default: null },
    logoDark: { type: String, default: null },
    logoLight: { type: String, default: null },
    favicon: { type: String, default: null },
    heroImage: { type: String, default: null },
    placeholder: { type: String, default: null },
    defaultBox: { type: String, default: null },
    defaultPrize: { type: String, default: null }
  },

  // الأيقونات
  icons: {
    set: {
      type: String,
      enum: ['lucide', 'fontawesome', 'custom'],
      default: 'lucide'
    },
    customIcons: { type: Map, of: String }
  },

  // النصوص
  texts: {
    // الترحيب
    welcomeTitle: { type: String, default: 'مرحباً بك' },
    welcomeSubtitle: { type: String, default: 'في منصة PuzzleChain' },
    // الأزرار
    openBoxBtn: { type: String, default: 'فتح الصندوق' },
    buyBtn: { type: String, default: 'شراء' },
    sendGiftBtn: { type: String, default: 'إرسال هدية' },
    // الرسائل
    noResults: { type: String, default: 'لا توجد نتائج' },
    loadingText: { type: String, default: 'جاري التحميل...' },
    errorText: { type: String, default: 'حدث خطأ' },
    successText: { type: String, default: 'تم بنجاح' }
  },

  // إعدادات اللغة
  language: {
    default: { type: String, default: 'ar' },
    supported: [{ type: String }],
    rtl: { type: Boolean, default: true }
  },

  // الوضع
  isActive: {
    type: Boolean,
    default: true
  },
  isDefault: {
    type: Boolean,
    default: false
  },

  // المستخدم
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index
customizationSchema.index({ type: 1, target: 1 });
customizationSchema.index({ isActive: 1 });
customizationSchema.index({ createdBy: 1 });

module.exports = mongoose.model('Customization', customizationSchema);