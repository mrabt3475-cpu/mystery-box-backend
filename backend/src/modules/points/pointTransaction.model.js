import mongoose from 'mongoose';

const pointTransactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['earn', 'spend', 'bonus', 'refund', 'expire'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  balanceAfter: {
    type: Number,
    required: true
  },
  // السبب
  reason: {
    type: String,
    enum: [
      'purchase_reward',      // نقاط من شراء منتج
      'referral_bonus',       // نقاط إحالة
      'daily_login',          // نقاط تسجيل الدخول
      'review',               // نقاط تقييم منتج
      'create_group',         // إنشاء مجموعة
      'create_channel',       // إنشاء قناة
      'create_bot',           // إنشاء بوت
      'upgrade_bot',          // ترقية بوت
      'extend_service',       // تمديد خدمة
      'gift_points',          // إرسال نقاط كهدية
      'receive_gift',         // استقبال نقاط هدية
      'refund_purchase',      // استرجاع نقاط
      'points_expired'        // نقاط منتهية
    ],
    required: true
  },
  // تفاصيل إضافية
  metadata: {
    orderId: mongoose.Schema.Types.ObjectId,
    productId: mongoose.Schema.Types.ObjectId,
    serviceId: mongoose.Schema.Types.ObjectId,
    referralId: mongoose.Schema.Types.ObjectId,
    giftTo: mongoose.Schema.Types.ObjectId,
    description: String
  },
  // حالة المعاملة
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'cancelled'],
    default: 'completed'
  },
  createdAt: { type: Date, default: Date.now },
  expiresAt: Date
});

// Index
pointTransactionSchema.index({ user: 1, createdAt: -1 });
pointTransactionSchema.index({ type: 1 });
pointTransactionSchema.index({ reason: 1 });
pointTransactionSchema.index({ expiresAt: 1 });

export default mongoose.model('PointTransaction', pointTransactionSchema);
