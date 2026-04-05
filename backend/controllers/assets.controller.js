/**
 * 🎮 Character Assets Controller
 */

const assetsService = require('../services/assets.service');


const importAsset = async (req, res) => {
  try {
    const { characterId, type, url, options } = req.body;
    if (!characterId || !type || !url) {
      return res.status(400).json({ success: false, error: 'Character ID, type, and URL are required' });
    }

    let result;
    switch (type) {
      case 'model': result = await assetsService.importModel(characterId, url, options); break;
      case 'texture': result = await assetsService.importTexture(characterId, url); break;
      case 'preview': result = await assetsService.importPreview(characterId, url); break;
      default: return res.status(400).json({ success: false, error: 'Invalid asset type' });
    }

    if (req.io) {
      req.io.emit('asset-imported', { characterId, type, url, timestamp: result.timestamp });
    }

    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const getAsset = async (req, res) => {
  try {
    const { characterId } = req.params;
    const asset = assetsService.getAsset(characterId);
    if (!asset) return res.status(404).json({ success: false, error: 'Asset not found' });
    res.json({ success: true, data: asset });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const getAllAssets = async (req, res) => {
  try {
    const assets = assetsService.getAllAssets();
    res.json({ success: true, data: assets, count: assets.length });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const getCharactersWithModels = async (req, res) => {
  try {
    const characters = assetsService.getCharactersWithModels();
    res.json({ success: true, data: characters, count: characters.length });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const removeAsset = async (req, res) => {
  try {
    const { characterId } = req.params;
    const result = assetsService.removeAsset(characterId);
    if (req.io) req.io.emit('asset-removed', { characterId, timestamp: new Date().toISOString() });
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const uploadAsset = async (req, res) => {
  try {
    const { characterId, type, fileData } = req.body;
    const result = await assetsService.uploadFile(characterId, fileData, type);
    if (req.io) req.io.emit('asset-uploaded', { characterId, type, timestamp: result.timestamp });
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { importAsset, getAsset, getAllAssets, getCharactersWithModels, removeAsset, uploadAsset };