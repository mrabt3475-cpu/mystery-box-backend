/**
 * 🎮 Asset Model - MongoDB Version
 * نموذج الأصول
 */

const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema({
  characterId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
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
  source: {
    type: String,
    enum: ['local', 'external'],
    default: 'local'
  },
  format: {
    type: String,
    default: 'glb'
  },
  scale: {
    type: Object,
    default: () => ({ x: 1, y: 1, z: 1 })
  },
  position: {
    type: Object,
    default: () => ({ x: 0, y: 0, z: 0 })
  },
  rotation: {
    type: Object,
    default: () => ({ x: 0, y: 0, z: 0 })
  },
  metadata: {
    type: Object,
    default: {}
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
assetSchema.index({ source: 1 });
assetSchema.index({ lastUpdated: -1 });

// Pre-save middleware
assetSchema.pre('save', function(next) {
  this.lastUpdated = new Date();
  next();
});

// Static methods
assetSchema.statics.getWithModels = async function() {
  return this.find({ modelUrl: { $ne: null } });
};

assetSchema.statics.getStats = async function() {
  const total = await this.countDocuments();
  const withModels = await this.countDocuments({ modelUrl: { $ne: null } });
  const withTextures = await this.countDocuments({ textureUrl: { $ne: null } });
  const withPreviews = await this.countDocuments({ previewUrl: { $ne: null } });
  const external = await this.countDocuments({ source: 'external' });
  const local = await this.countDocuments({ source: 'local' });
  
  return { total, withModels, withTextures, withPreviews, external, local };
};

module.exports = mongoose.model('Asset', assetSchema);
