const mongoose = require('mongoose');

const apiKeySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  key: {
    type: String,
    required: true,
    unique: true
  },
  prefix: {
    type: String,
    required: true
  },
  permissions: [{
    type: String,
    enum: ['read', 'write', 'admin']
  }],
  rateLimit: {
    type: Number,
    default: 100
  },
  expiresAt: {
    type: Date,
    default: null
  },
  lastUsed: {
    type: Date,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  },
  usageCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

apiKeySchema.index({ user: 1 });
apiKeySchema.index({ key: 1 });

module.exports = mongoose.model('ApiKey', apiKeySchema);
