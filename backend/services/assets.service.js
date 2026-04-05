/**
 * 🎮 Character Assets Service
 * خدمة إدارة أصول الشخصيات ثلاثية الأبعاد
 */

const path = require('path');

let assetsStore = {};

const ALLOWED_EXTENSIONS = {
  model: ['.glb', '.gltf', '.fbx', '.obj'],
  texture: ['.png', '.jpg', '.jpeg', '.webp', '.gif'],
  preview: ['.png', '.jpg', '.jpeg', '.webp', '.gif'],
  icon: ['.png', '.jpg', '.jpeg', '.webp', '.svg']
};

const ALLOWED_DOMAINS = [
  'cdn.example.com',
  'assets.example.com',
  'raw.githubusercontent.com',
  'media.githubusercontent.com',
  'cdn.jsdelivr.net',
  'unpkg.com'
];

const isValidUrl = (url) => {
  try {
    const parsed = new URL(url);
    return ALLOWED_DOMAINS.some(domain => parsed.hostname.includes(domain));
  } catch { return false; }
};

const importModel = async (characterId, modelUrl, options = {}) => {
  if (!characterId || !modelUrl) throw new Error('Character ID and model URL are required');
  if (!isValidUrl(modelUrl)) throw new Error('Invalid URL or domain not allowed');

  const asset = assetsStore[characterId] || {
    id: characterId,
    modelUrl: null,
    textureUrl: null,
    previewUrl: null,
    iconUrl: null,
    source: 'local',
    lastUpdated: null,
    format: options.format || 'glb',
    scale: options.scale || { x: 1, y: 1, z: 1 }
  };

  asset.modelUrl = modelUrl;
  asset.source = 'external';
  asset.lastUpdated = new Date().toISOString();
  asset.format = options.format || path.extname(modelUrl).slice(1);
  asset.scale = options.scale || asset.scale;
  assetsStore[characterId] = asset;


  return { success: true, characterId, modelUrl, format: asset.format, timestamp: asset.lastUpdated };
};

const importTexture = async (characterId, textureUrl) => {
  if (!characterId || !textureUrl) throw new Error('Character ID and texture URL are required');
  if (!isValidUrl(textureUrl)) throw new Error('Invalid URL or domain not allowed');

  const asset = assetsStore[characterId] || { id: characterId };
  asset.textureUrl = textureUrl;
  asset.lastUpdated = new Date().toISOString();
  assetsStore[characterId] = asset;

  return { success: true, characterId, textureUrl, timestamp: asset.lastUpdated };
};

const importPreview = async (characterId, previewUrl) => {
  if (!characterId || !previewUrl) throw new Error('Character ID and preview URL are required');
  if (!isValidUrl(previewUrl)) throw new Error('Invalid URL or domain not allowed');

  const asset = assetsStore[characterId] || { id: characterId };
  asset.previewUrl = previewUrl;
  asset.lastUpdated = new Date().toISOString();
  assetsStore[characterId] = asset;

  return { success: true, characterId, previewUrl, timestamp: asset.lastUpdated };
};

const getAsset = (characterId) => assetsStore[characterId] || null;
const getAllAssets = () => Object.values(assetsStore);
const getCharactersWithModels = () => Object.values(assetsStore).filter(a => a.modelUrl !== null);

const removeAsset = (characterId) => {
  if (!assetsStore[characterId]) throw new Error('Character ' + characterId + ' not found');
  delete assetsStore[characterId];
  return { success: true, characterId, message: 'Asset removed successfully' };
};

const uploadFile = async (characterId, fileData, type) => {
  if (!characterId || !fileData || !type) throw new Error('Character ID, file data, and type are required');

  const asset = assetsStore[characterId] || { id: characterId };
  switch (type) {
    case 'model': asset.modelUrl = 'local://' + characterId + '.glb'; asset.format = 'glb'; break;
    case 'texture': asset.textureUrl = 'local://' + characterId + '_texture.png'; break;
    case 'preview': asset.previewUrl = 'local://' + characterId + '_preview.png'; break;
    default: throw new Error('Invalid file type');
  }
  asset.source = 'local';
  asset.lastUpdated = new Date().toISOString();
  assetsStore[characterId] = asset;

  return { success: true, characterId, type, timestamp: asset.lastUpdated };
};

module.exports = {
  importModel, importTexture, importPreview,
  getAsset, getAllAssets, getCharactersWithModels,
  removeAsset, uploadFile, isValidUrl,
  ALLOWED_EXTENSIONS, ALLOWED_DOMAINS
};