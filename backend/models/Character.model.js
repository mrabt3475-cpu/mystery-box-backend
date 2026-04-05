/**
 * 🎮 Character Model - MongoDB
 * نموذج الشخصيات
 */

const mongoose = require('mongoose');

const characterSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  nameEn: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500
  },
  icon: {
    type: String,
    default: '🎮'
  },
  rarity: {
    type: String,
    enum: ['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic'],
    default: 'common',
    index: true
  },
  category: {
    type: String,
    default: 'general',
    index: true
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  // 3D Asset references
  modelUrl: {
    type: String,
    default: null
  },
  textureUrl: {
    type: String,
    default: null
  },
  previewUrl: {
    type: String,
    default: null
  },
  iconUrl: {
    type: String,
    default: null
  },
  modelFormat: {
    type: String,
    default: 'glb'
  },
  modelScale: {
    type: Object,
    default: () => ({ x: 1, y: 1, z: 1 })
  },
  modelPosition: {
    type: Object,
    default: () => ({ x: 0, y: 0, z: 0 })
  },
  modelRotation: {
    type: Object,
    default: () => ({ x: 0, y: 0, z: 0 })
  },
  // Metadata
  source: {
    type: String,
    enum: ['local', 'external'],
    default: 'local'
  },
  metadata: {
    type: Object,
    default: {}
  },
  stats: {
    timesOpened: { type: Number, default: 0 },
    timesWon: { type: Number, default: 0 },
    totalValue: { type: Number, default: 0 }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for asset status
characterSchema.virtual('hasModel').get(function() {
  return !!this.modelUrl;
});

// Indexes
characterSchema.index({ isActive: 1, rarity: 1 });
characterSchema.index({ category: 1, isActive: 1 });
characterSchema.index({ hasModel: 1 });

// Static method to get characters with models
characterSchema.statics.getWithModels = async function() {
  return this.find({ modelUrl: { $ne: null }, isActive: true });
};

// Static method to get by rarity
characterSchema.statics.getByRarity = async function(rarity) {
  return this.find({ rarity, isActive: true });
};

module.exports = mongoose.model('Character', characterSchema);
