/**
 * 🎮 Character Assets Routes
 */

const express = require('express');
const router = express.Router();
const assetsController = require('../controllers/assets.controller');

router.post('/import', assetsController.importAsset);
router.get('/', assetsController.getAllAssets);
router.get('/with-models', assetsController.getCharactersWithModels);
router.get('/:characterId', assetsController.getAsset);
router.delete('/:characterId', assetsController.removeAsset);
router.post('/upload', assetsController.uploadAsset);

module.exports = router;