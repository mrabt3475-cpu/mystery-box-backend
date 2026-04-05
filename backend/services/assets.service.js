/**
 * 🎮 Character Assets Service - MongoDB Version
 * خدمة إدارة أصول الشخصيات
 */

const Asset = require('../models/Asset');
const Character = require('../models/Character.model');
const path = require('path');

// Allowed extensions for security
const ALLOWED_EXTENSIONS = {
  model: ['.glb', '.gltf', '.fbx', '.obj'],
  texture: ['.png', '.jpg', '.jpeg', '.webp', '.gif'],
  preview: ['.png', '.jpg', '.jpeg', '.webp', '.gif'],
  icon: ['.png', '.jpg', '.jpeg', '.webp', '.svg']
};

// Trusted domains only
const ALLOWED_DOMAINS = [
  'cdn.example.com',
  'assets.example.com',
  'raw.githubusercontent.com',
  'media.githubusercontent.com',
  'cdn.jsdelivr.net',
  'unpkg.com',
  'cdn.jsdelivr.org',
  'fastly.jsdelivr.net',
  'huggingface.co',
  'models.readyplayer.me'
];

// Rate limiting storage
const rateLimitStore = new Map();
const RATE_LIMIT = 10;
const RATE_WINDOW = 60000;

/**
 * Check rate limit
 */
const checkRateLimit = (userId) => {
  const now = Date.now();
  const userRequests = rateLimitStore.get(userId) || [];
  const recentRequests = userRequests.filter(timestamp => now - timestamp < RATE_WINDOW);
  
  if (recentRequests.length >= RATE_LIMIT) {
    throw new Error('Rate limit exceeded. Please try again later.');
  }
  
  recentRequests.push(now);
  rateLimitStore.set(userId, recentRequests);
  
  if (rateLimitStore.size > 1000) {
    rateLimitStore.clear();
  }
};

/**
 * Validate URL
 */
const isValidUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  
  try {
    const parsed = new URL(url);
    if (!['http:', 'https:'].includes(parsed.protocol)) return false;
    return ALLOWED_DOMAINS.some(domain => parsed.hostname.includes(domain));
  } catch {
    return false;
  }
};

/**
 * Validate extension
 */
const isValidExtension = (url, type) => {
  const ext = path.extname(url).toLowerCase();
  return ALLOWED_EXTENSIONS[type]?.includes(ext) || false;
};

/**
 * Sanitize input
 */
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return '';
  return input.trim().replace(/[<>"']/g, '');
};

/**
 * Import 3D model
 */
const importModel = async (characterId, modelUrl, options = {}, userId = null) => {
  if (!characterId || !modelUrl) {
    throw new Error('Character ID and model URL are required');
  }
  
  const sanitizedCharacterId = sanitizeInput(characterId);
  const sanitizedUrl = sanitizeInput(modelUrl);
  
  if (!isValidUrl(sanitizedUrl)) {
    throw new Error('Invalid URL or domain not allowed');
  }
  
  if (!isValidExtension(sanitizedUrl, 'model')) {
    throw new Error('Invalid model format. Allowed: GLB, GLTF, FBX, OBJ');
  }
  
  if (userId) checkRateLimit(userId);
  
  // Check if character exists
  const character = await Character.findOne({ id: sanitizedCharacterId });
  if (!character) {
    throw new Error('Character not found');
  }
  
  // Find or create asset
  let asset = await Asset.findOne({ characterId: sanitizedCharacterId });
  
  const updateData = {
    modelUrl: sanitizedUrl,
    source: 'external',
    format: options.format || path.extname(sanitizedUrl).slice(1),
    scale: options.scale || { x: 1, y: 1, z: 1 },
    position: options.position || { x: 0, y: 0, z: 0 },
    rotation: options.rotation || { x: 0, y: 0, z: 0 },
    lastUpdated: new Date()
  };
  
  if (!asset) {
    asset = new Asset({ characterId: sanitizedCharacterId, ...updateData });
  } else {
    asset.set(updateData);
  }
  
  await asset.save();
  
  // Also update character
  await Character.updateOne(
    { id: sanitizedCharacterId },
    { 
      modelUrl: sanitizedUrl,
      modelFormat: updateData.format,
      modelScale: updateData.scale,
      source: 'external'
    }
  );
  
  return {
    success: true,
    characterId: sanitizedCharacterId,
    modelUrl: sanitizedUrl,
    format: asset.format,
    timestamp: asset.lastUpdated
  };
};

/**
 * Import texture
 */
const importTexture = async (characterId, textureUrl, userId = null) => {
  if (!characterId || !textureUrl) {
    throw new Error('Character ID and texture URL are required');
  }
  
  const sanitizedCharacterId = sanitizeInput(characterId);
  const sanitizedUrl = sanitizeInput(textureUrl);
  
  if (!isValidUrl(sanitizedUrl)) {
    throw new Error('Invalid URL or domain not allowed');
  }
  
  if (!isValidExtension(sanitizedUrl, 'texture')) {
    throw new Error('Invalid texture format');
  }
  
  if (userId) checkRateLimit(userId);
  
  let asset = await Asset.findOne({ characterId: sanitizedCharacterId });
  
  if (!asset) {
    asset = new Asset({ characterId: sanitizedCharacterId, textureUrl: sanitizedUrl });
  } else {
    asset.textureUrl = sanitizedUrl;
  }
  
  await asset.save();
  
  return {
    success: true,
    characterId: sanitizedCharacterId,
    textureUrl: sanitizedUrl,
    timestamp: asset.lastUpdated
  };
};

/**
 * Import preview
 */
const importPreview = async (characterId, previewUrl, userId = null) => {
  if (!characterId || !previewUrl) {
    throw new Error('Character ID and preview URL are required');
  }
  
  const sanitizedCharacterId = sanitizeInput(characterId);
  const sanitizedUrl = sanitizeInput(previewUrl);
  
  if (!isValidUrl(sanitizedUrl)) {
    throw new Error('Invalid URL or domain not allowed');
  }
  
  if (!isValidExtension(sanitizedUrl, 'preview')) {
    throw new Error('Invalid preview format');
  }
  
  if (userId) checkRateLimit(userId);
  
  let asset = await Asset.findOne({ characterId: sanitizedCharacterId });
  
  if (!asset) {
    asset = new Asset({ characterId: sanitizedCharacterId, previewUrl: sanitizedUrl });
  } else {
    asset.previewUrl = sanitizedUrl;
  }
  
  await asset.save();
  
  return {
    success: true,
    characterId: sanitizedCharacterId,
    previewUrl: sanitizedUrl,
    timestamp: asset.lastUpdated
  };
};

/**
 * Get asset
 */
const getAsset = async (characterId) => {
  if (!characterId) {
    throw new Error('Character ID is required');
  }
  
  const asset = await Asset.findOne({ characterId: sanitizeInput(characterId) });
  return asset ? asset.toJSON() : null;
};

/**
 * Get all assets
 */
const getAllAssets = async (limit = 50, offset = 0) => {
  const assets = await Asset.find()
    .sort({ lastUpdated: -1 })
    .skip(offset)
    .limit(Math.min(limit, 100));
  
  return assets.map(a => a.toJSON());
};

/**
 * Get characters with models
 */
const getCharactersWithModels = async () => {
  const assets = await Asset.find({ modelUrl: { $ne: null } });
  return assets.map(a => a.toJSON());
};

/**
 * Remove asset
 */
const removeAsset = async (characterId, userId = null) => {
  if (!characterId) {
    throw new Error('Character ID is required');
  }
  
  const sanitizedCharacterId = sanitizeInput(characterId);
  const asset = await Asset.findOne({ characterId: sanitizedCharacterId });
  
  if (!asset) {
    throw new Error('Asset not found');
  }
  
  await asset.deleteOne();
  
  // Also update character
  await Character.updateOne(
    { id: sanitizedCharacterId },
    { modelUrl: null, textureUrl: null, previewUrl: null, source: 'local' }
  );
  
  return {
    success: true,
    characterId: sanitizedCharacterId,
    message: 'Asset removed successfully'
  };
};

/**
 * Upload file (for file upload support)
 */
const uploadFile = async (characterId, fileData, type, userId = null) => {
  if (!characterId || !fileData || !type) {
    throw new Error('Character ID, file data, and type are required');
  }
  
  if (userId) checkRateLimit(userId);
  
  const validTypes = ['model', 'texture', 'preview', 'icon'];
  if (!validTypes.includes(type)) {
    throw new Error('Invalid file type');
  }
  
  // In production, this would upload to S3/cloud storage
  // For now, return a placeholder
  const localUrl = `local://${characterId}_${type}.${type === 'model' ? 'glb' : 'png'}`;
  
  let asset = await Asset.findOne({ characterId: sanitizeInput(characterId) });
  const urlField = type + 'Url';
  
  if (!asset) {
    asset = new Asset({
      characterId: sanitizeInput(characterId),
      [urlField]: localUrl,
      source: 'local'
    });
  } else {
    asset[urlField] = localUrl;
    asset.source = 'local';
  }
  
  await asset.save();
  
  return {
    success: true,
    characterId: sanitizeInput(characterId),
    type,
    url: localUrl,
    timestamp: new Date()
  };
};

/**
 * Get stats
 */
const getAssetStats = async () => {
  return await Asset.getStats();
};

module.exports = {
  importModel,
  importTexture,
  importPreview,
  getAsset,
  getAllAssets,
  getCharactersWithModels,
  removeAsset,
  uploadFile,
  getAssetStats,
  isValidUrl,
  ALLOWED_EXTENSIONS,
  ALLOWED_DOMAINS
};
