/**
 * 🎮 Character Assets Configuration
 * إعدادات استيراد الأصول ثلاثية الأبعاد
 * 
 * Supports importing from:
 * - External URLs (CDN, GitHub, etc.)
 * - 3D Models (GLB, GLTF, FBX, OBJ)
 * - Textures (PNG, JPG, WebP)
 * - Preview Images
 */

// ========================
// 📦 3D Models Configuration
// ========================

export const CHARACTER_ASSETS = {
  // Enable external URL imports
  importEnabled: true,
  
  // Allowed domains for external imports
  allowedDomains: [
    'cdn.example.com',
    'assets.example.com',
    'raw.githubusercontent.com',
    'media.githubusercontent.com',
    'cdn.jsdelivr.net',
    'unpkg.com'
  ],

  // Default 3D model settings
  modelDefaults: {
    format: 'glb',
    scale: { x: 1, y: 1, z: 1 },
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    animation: 'idle',
    shadow: true,
    lighting: 'default'
  },

  // Character 3D Assets
  models: {
    archer: { id: 'archer', modelUrl: null, textureUrl: null, previewUrl: null, iconUrl: null, source: 'local', lastUpdated: null, format: 'glb', scale: { x: 1, y: 1, z: 1 } },
    pirate: { id: 'pirate', modelUrl: null, textureUrl: null, previewUrl: null, iconUrl: null, source: 'local', lastUpdated: null, format: 'glb', scale: { x: 1, y: 1, z: 1 } },
    robot: { id: 'robot', modelUrl: null, textureUrl: null, previewUrl: null, iconUrl: null, source: 'local', lastUpdated: null, format: 'glb', scale: { x: 1, y: 1, z: 1 } },
    ghost: { id: 'ghost', modelUrl: null, textureUrl: null, previewUrl: null, iconUrl: null, source: 'local', lastUpdated: null, format: 'glb', scale: { x: 1, y: 1, z: 1 } },
    warrior: { id: 'warrior', modelUrl: null, textureUrl: null, previewUrl: null, iconUrl: null, source: 'local', lastUpdated: null, format: 'glb', scale: { x: 1, y: 1, z: 1 } },
    wizard: { id: 'wizard', modelUrl: null, textureUrl: null, previewUrl: null, iconUrl: null, source: 'local', lastUpdated: null, format: 'glb', scale: { x: 1, y: 1, z: 1 } },
    werewolf: { id: 'werewolf', modelUrl: null, textureUrl: null, previewUrl: null, iconUrl: null, source: 'local', lastUpdated: null, format: 'glb', scale: { x: 1, y: 1, z: 1 } },
    ninja: { id: 'ninja', modelUrl: null, textureUrl: null, previewUrl: null, iconUrl: null, source: 'local', lastUpdated: null, format: 'glb', scale: { x: 1, y: 1, z: 1 } },
    dragon: { id: 'dragon', modelUrl: null, textureUrl: null, previewUrl: null, iconUrl: null, source: 'local', lastUpdated: null, format: 'glb', scale: { x: 1, y: 1, z: 1 } },
    unicorn: { id: 'unicorn', modelUrl: null, textureUrl: null, previewUrl: null, iconUrl: null, source: 'local', lastUpdated: null, format: 'glb', scale: { x: 1, y: 1, z: 1 } },
    alien: { id: 'alien', modelUrl: null, textureUrl: null, previewUrl: null, iconUrl: null, source: 'local', lastUpdated: null, format: 'glb', scale: { x: 1, y: 1, z: 1 } },
    grandDragon: { id: 'grandDragon', modelUrl: null, textureUrl: null, previewUrl: null, iconUrl: null, source: 'local', lastUpdated: null, format: 'glb', scale: { x: 1, y: 1, z: 1 } }
  },

  // Import functions
  isValidUrl: function(url) {
    try {
      const parsed = new URL(url);
      return this.allowedDomains.some(domain => parsed.hostname.includes(domain));
    } catch { return false; }
  },

  importModel: function(characterId, modelUrl, options = {}) {
    if (!this.models[characterId]) throw new Error('Character ' + characterId + ' not found');
    if (!this.isValidUrl(modelUrl)) throw new Error('Invalid URL or domain not allowed');
    const model = this.models[characterId];
    model.modelUrl = modelUrl;
    model.source = 'external';
    model.lastUpdated = new Date().toISOString();
    model.format = options.format || 'glb';
    model.scale = options.scale || this.modelDefaults.scale;
    return { success: true, characterId, modelUrl };
  },

  importTexture: function(characterId, textureUrl) {
    if (!this.models[characterId]) throw new Error('Character ' + characterId + ' not found');
    if (!this.isValidUrl(textureUrl)) throw new Error('Invalid URL or domain not allowed');
    const model = this.models[characterId];
    model.textureUrl = textureUrl;
    model.lastUpdated = new Date().toISOString();
    return { success: true, characterId, textureUrl };
  },

  importPreview: function(characterId, previewUrl) {
    if (!this.models[characterId]) throw new Error('Character ' + characterId + ' not found');
    if (!this.isValidUrl(previewUrl)) throw new Error('Invalid URL or domain not allowed');
    const model = this.models[characterId];
    model.previewUrl = previewUrl;
    model.lastUpdated = new Date().toISOString();
    return { success: true, characterId, previewUrl };
  },

  getAsset: function(characterId) {
    return this.models[characterId] || null;
  },

  hasModel: function(characterId) {
    const model = this.models[characterId];
    return model && model.modelUrl !== null;
  },

  removeAsset: function(characterId) {
    if (!this.models[characterId]) throw new Error('Character ' + characterId + ' not found');
    const model = this.models[characterId];
    model.modelUrl = null;
    model.textureUrl = null;
    model.previewUrl = null;
    model.iconUrl = null;
    model.source = 'local';
    model.lastUpdated = null;
    return { success: true, characterId };
  },

  getCharactersWithModels: function() {
    return Object.values(this.models).filter(m => m.modelUrl !== null);
  }
};

export const ASSETS_API = {
  baseUrl: '/api/assets',
  endpoints: {
    import: 'POST /api/assets/import',
    list: 'GET /api/assets/list',
    get: 'GET /api/assets/:characterId',
    remove: 'DELETE /api/assets/:characterId',
    upload: 'POST /api/assets/upload',
    preview: 'GET /api/assets/:characterId/preview'
  }
};

export const VIEWER_SETTINGS = {
  background: '#1a1a2e',
  cameraPosition: { x: 0, y: 1, z: 5 },
  autoRotate: true,
  autoRotateSpeed: 2,
  enableZoom: true,
  enablePan: false,
  enableRotate: true,
  lighting: {
    ambient: { intensity: 0.5 },
    directional: { intensity: 1, position: { x: 5, y: 5, z: 5 } }
  },
  shadow: true,
  shadowType: 'PCFSoftShadowMap'
};

export default CHARACTER_ASSETS;