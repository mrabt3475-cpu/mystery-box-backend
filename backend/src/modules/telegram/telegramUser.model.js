import mongoose from 'mongoose';

const telegramUserSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  telegramId: {
    type: String,
    required: true,
    unique: true
  },
  username: String,
  firstName: String,
  lastName: String,
  photoUrl: String,
  authDate: Date,
  isVerified: {
    type: Boolean,
    default: false
  },
  linkedAt: {
    type: Date,
    default: Date.now
  },
  lastInteraction: Date,
  notificationsEnabled: {
    type: Boolean,
    default: true
  },
  preferredChannel: {
    type: String,
    enum: ['telegram', 'site', 'both'],
    default: 'both'
  }
}, {
  timestamps: true
});

// Index for fast queries
telegramUserSchema.index({ telegramId: 1 });
telegramUserSchema.index({ user: 1 });

export default mongoose.model('TelegramUser', telegramUserSchema);
