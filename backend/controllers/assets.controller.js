/**
 * 🎮 Character Assets Controller - Improved Version
 * وحدة التحكم في أصول الشخصيات
 * 
 * Features:
 * - Authentication middleware
 * - Input validation
 * - Error handling
 * - Audit logging
 * - Real-time updates via Socket.IO
 */

const assetsService = require('../services/assets.service');
const { validationResult } = require('express-validator');

/**
 * Validate request inputs
 */
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array()
    });
  }
  next();
};

/**
 * Import asset (model, texture, or preview)
 */
const importAsset = async (req, res) => {
  try {
    const { characterId, type, url, options } = req.body;
    const userId = req.user?.id;
    
    // Validate required fields
    if (!characterId || !type || !url) {
      return res.status(400).json({
        success: false,
        error: 'Character ID, type, and URL are required'
      });
    }
    
    // Validate type
    const validTypes = ['model', 'texture', 'preview'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid asset type. Allowed: model, texture, preview'
      });
    }
    
    let result;
    
    switch (type) {
      case 'model':
        result = await assetsService.importModel(characterId, url, options || {}, userId);
        break;
      case 'texture':
        result = await assetsService.importTexture(characterId, url, userId);
        break;
      case 'preview':
        result = await assetsService.importPreview(characterId, url, userId);
        break;
      default:
        return res.status(400).json({ success: false, error: 'Invalid asset type' });
    }
    
    // Emit real-time update
    if (req.io) {
      req.io.emit('asset-imported', {
        characterId,
        type,
        url,
        timestamp: result.timestamp,
        importedBy: userId
      });
    }
    
    // Log audit
    console.log(`[AUDIT] Asset imported: ${type} for ${characterId} by user ${userId}`);
    
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('[ERROR] Import asset:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Get asset for a specific character
 */
const getAsset = async (req, res) => {
  try {
    const { characterId } = req.params;
    
    if (!characterId) {
      return res.status(400).json({
        success: false,
        error: 'Character ID is required'
      });
    }
    
    const asset = await assetsService.getAsset(characterId);
    
    if (!asset) {
      return res.status(404).json({
        success: false,
        error: 'Asset not found'
      });
    }
    
    res.json({ success: true, data: asset });
  } catch (error) {
    console.error('[ERROR] Get asset:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Get all assets with pagination
 */
const getAllAssets = async (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;
    
    const assets = await assetsService.getAllAssets(
      parseInt(limit),
      parseInt(offset)
    );
    
    const stats = await assetsService.getAssetStats();
    
    res.json({
      success: true,
      data: assets,
      count: assets.length,
      stats,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    });
  } catch (error) {
    console.error('[ERROR] Get all assets:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Get characters with 3D models
 */
const getCharactersWithModels = async (req, res) => {
  try {
    const characters = await assetsService.getCharactersWithModels();
    
    res.json({
      success: true,
      data: characters,
      count: characters.length
    });
  } catch (error) {
    console.error('[ERROR] Get characters with models:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Remove asset for a character
 */
const removeAsset = async (req, res) => {
  try {
    const { characterId } = req.params;
    const userId = req.user?.id;
    
    if (!characterId) {
      return res.status(400).json({
        success: false,
        error: 'Character ID is required'
      });
    }
    
    const result = await assetsService.removeAsset(characterId, userId);
    
    // Emit real-time update
    if (req.io) {
      req.io.emit('asset-removed', {
        characterId,
        timestamp: new Date().toISOString(),
        removedBy: userId
      });
    }
    
    // Log audit
    console.log(`[AUDIT] Asset removed: ${characterId} by user ${userId}`);
    
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('[ERROR] Remove asset:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Upload file (for file upload support)
 */
const uploadAsset = async (req, res) => {
  try {
    const { characterId, type } = req.body;
    const userId = req.user?.id;
    
    if (!characterId || !type) {
      return res.status(400).json({
        success: false,
        error: 'Character ID and type are required'
      });
    }
    
    // Check if file exists
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded'
      });
    }
    
    const fileData = req.file.buffer.toString('base64');
    const result = await assetsService.uploadFile(characterId, fileData, type, userId);
    
    // Emit real-time update
    if (req.io) {
      req.io.emit('asset-uploaded', {
        characterId,
        type,
        timestamp: result.timestamp,
        uploadedBy: userId
      });
    }
    
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('[ERROR] Upload asset:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Get asset statistics
 */
const getAssetStats = async (req, res) => {
  try {
    const stats = await assetsService.getAssetStats();
    res.json({ success: true, data: stats });
  } catch (error) {
    console.error('[ERROR] Get asset stats:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  importAsset,
  getAsset,
  getAllAssets,
  getCharactersWithModels,
  removeAsset,
  uploadAsset,
  getAssetStats,
  validateRequest
};
