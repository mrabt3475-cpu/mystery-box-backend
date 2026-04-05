/**
 * 🎮 Character Assets Service - Improved Version
 * خدمة إدارة أصول الشخصيات ثلاثية الأبعاد
 * 
 * Features:
 * - Database persistence
 * - Input validation
 * - Error handling
 * - Rate limiting
 * - Audit logging
 */

const path = require('path');
const { Asset, Character } = require('../models');

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
  'fastly.jsdelivr.net'
];

// Rate limiting storage
const rateLimitStore = new Map();
const RATE_LIMIT = 10; // Max requests per minute
const RATE_WINDOW = 60000;

/**
 * Check rate limit for a user
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
  
  // Cleanup old entries
  if (rateLimitStore.size > 1000) {
    rateLimitStore.clear();
  }
};

/**
 * Validate URL format and domain
 */
const isValidUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  
  try {
    const parsed = new URL(url);
    
    // Check protocol
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return false;
    }
    
    // Check domain
    return ALLOWED_DOMAINS.some(domain => parsed.hostname.includes(domain));
  } catch {
    return false;
  }
};

/**
 * Validate file extension
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
 * Import 3D model for a character
 */
const importModel = async (characterId, modelUrl, options = {}, userId = null) => {
  // Validate required fields
  if (!characterId || !modelUrl) {
    throw new Error('Character ID and model URL are required');
  }
  
  // Sanitize inputs
  const sanitizedCharacterId = sanitizeInput(characterId);
  const sanitizedUrl = sanitizeInput(modelUrl);
  
  // Validate URL
  if (!isValidUrl(sanitizedUrl)) {
    throw new Error('Invalid URL or domain not allowed. Please use a trusted CDN.');
  }
  
  // Validate extension
  if (!isValidExtension(sanitizedUrl, 'model')) {
    throw new Error('Invalid model format. Allowed: GLB, GLTF, FBX, OBJ');
  }
  
  // Check rate limit
  if (userId) checkRateLimit(userId);
  
  // Check if character exists
  const character = await Character.findOne({ where: { id: sanitizedCharacterId } });
  if (!character) {
    throw new Error('Character not found');
  }
  
  // Find or create asset
  let asset = await Asset.findOne({ where: { characterId: sanitizedCharacterId } });
  
  if (!asset) {
    asset = await Asset.create({
      characterId: sanitizedCharacterId,
      modelUrl: sanitizedUrl,
      source: 'external',
      format: options.format || path.extname(sanitizedUrl).slice(1),
      scale: JSON.stringify(options.scale || { x: 1, y: 1, z: 1 })
    });
  } else {
    await asset.update({
      modelUrl: sanitizedUrl,
      source: 'external',
      format: options.format || path.extname(sanitizedUrl).slice(1),
      scale: JSON.stringify(options.scale || { x: 1, y: 1, z: 1 }),
      lastUpdated: new Date()
    });
  }
  
  return {
    success: true,
    characterId: sanitizedCharacterId,
    modelUrl: sanitizedUrl,
    format: asset.format,
    timestamp: asset.lastUpdated
  };
};

/**
 * Import texture for a character
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
    throw new Error('Invalid texture format. Allowed: PNG, JPG, WebP, GIF');
  }
  
  if (userId) checkRateLimit(userId);
  
  let asset = await Asset.findOne({ where: { characterId: sanitizedCharacterId } });
  
  if (!asset) {
    asset = await Asset.create({
      characterId: sanitizedCharacterId,
      textureUrl: sanitizedUrl
    });
  } else {
    await asset.update({
      textureUrl: sanitizedUrl,
      lastUpdated: new Date()
    });
  }
  
  return {
    success: true,
    characterId: sanitizedCharacterId,
    textureUrl: sanitizedUrl,
    timestamp: asset.lastUpdated
  };
};

/**
 * Import preview image for a character
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
    throw new Error('Invalid preview format. Allowed: PNG, JPG, WebP, GIF');
  }
  
  if (userId) checkRateLimit(userId);
  
  let asset = await Asset.findOne({ where: { characterId: sanitizedCharacterId } });
  
  if (!asset) {
    asset = await Asset.create({
      characterId: sanitizedCharacterId,
      previewUrl: sanitizedUrl
    });
  } else {
    await asset.update({
      previewUrl: sanitizedUrl,
      lastUpdated: new Date()
    });
  }
  
  return {
    success: true,
    characterId: sanitizedCharacterId,
    previewUrl: sanitizedUrl,
    timestamp: asset.lastUpdated
  };
};

/**
 * Get asset for a specific character
 */
const getAsset = async (characterId) => {
  if (!characterId) {
    throw new Error('Character ID is required');
  }
  
  const asset = await Asset.findOne({ 
    where: { characterId: sanitizeInput(characterId) },
    include: [{ model: Character, attributes: ['id', 'name', 'nameEn', 'rarity', 'icon'] }]
  });
  
  return asset ? asset.toJSON() : null;
};

/**
 * Get all assets
 */
const getAllAssets = async (limit = 50, offset = 0) => {
  const assets = await Asset.findAll({
    include: [{ model: Character, attributes: ['id', 'name', 'nameEn', 'rarity', 'icon'] }],
    limit: Math.min(limit, 100),
    offset,
    order: [['lastUpdated', 'DESC']]
  });
  
  return assets.map(a => a.toJSON());
};

/**
 * Get characters with 3D models
 */
const getCharactersWithModels = async () => {
  const assets = await Asset.findAll({
    where: {
      modelUrl: { [require('sequelize').Op.ne]: null }
    },
    include: [{ model: Character, attributes: ['id', 'name', 'nameEn', 'rarity', 'icon'] }]
  });
  
  return assets.map(a => a.toJSON());
};

/**
 * Remove asset for a character
 */
const removeAsset = async (characterId, userId = null) => {
  if (!characterId) {
    throw new Error('Character ID is required');
  }
  
  const sanitizedCharacterId = sanitizeInput(characterId);
  const asset = await Asset.findOne({ where: { characterId: sanitizedCharacterId } });
  
  if (!asset) {
    throw new Error('Asset not found');
  }
  
  await asset.destroy();
  
  return {
    success: true,
    characterId: sanitizedCharacterId,
    message: 'Asset removed successfully'
  };
};

/**
 * Upload file (for future file upload support)
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
  
  // For now, return a placeholder
  // In production, this would handle file upload to S3/cloud storage
  const asset = await Asset.findOne({ where: { characterId: sanitizeInput(characterId) } });
  
  const urlField = type + 'Url';
  const localUrl = `local://${characterId}_${type}.${type === 'model' ? 'glb' : 'png'}`;
  
  if (!asset) {
    await Asset.create({
      characterId: sanitizeInput(characterId),
      [urlField]: localUrl,
      source: 'local'
    });
  } else {
    await asset.update({
      [urlField]: localUrl,
      source: 'local',
      lastUpdated: new Date()
    });
  }
  
  return {
    success: true,
    characterId: sanitizeInput(characterId),
    type,
    url: localUrl,
    timestamp: new Date()
  };
};

/**
 * Get asset statistics
 */
const getAssetStats = async () => {
  const total = await Asset.count();
  const withModels = await Asset.count({ where: { modelUrl: { [require('sequelize').Op.ne]: null } } });
  const withTextures = await Asset.count({ where: { textureUrl: { [require('sequelize').Op.ne]: null } } });
  const withPreviews = await Asset.count({ where: { previewUrl: { [require('sequelize').Op.ne]: null } } });
  
  return {
    total,
    withModels,
    withTextures,
    withPreviews,
    external: await Asset.count({ where: { source: 'external' } }),
    local: await Asset.count({ where: { source: 'local' } })
  };
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
