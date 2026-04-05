/**
 * 🎮 Character Assets Routes - Improved Version
 * مسارات أصول الشخصيات
 * 
 * Features:
 * - Authentication required
 * - Input validation
 * - Rate limiting
 */

const express = require('express');
const router = express.Router();
const assetsController = require('../controllers/assets.controller');
const { body, param, query } = require('express-validator');
const authMiddleware = require('../middleware/auth.middleware');
const rateLimit = require('../middleware/rateLimiter.middleware');

// Validation rules
const importValidation = [
  body('characterId').notEmpty().trim().escape(),
  body('type').isIn(['model', 'texture', 'preview']),
  body('url').isURL({ require_tld: true }),
  body('options').optional().isObject()
];

const characterIdValidation = [
  param('characterId').notEmpty().trim().escape()
];

const paginationValidation = [
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('offset').optional().isInt({ min: 0 })
];

// Apply auth middleware to all routes
router.use(authMiddleware.verifyToken);

// Public routes (read-only, no auth required)
router.get('/stats', assetsController.getAssetStats);

// Protected routes
router.post(
  '/import',
  rateLimit.apiLimiter,
  importValidation,
  assetsController.validateRequest,
  assetsController.importAsset
);

router.get(
  '/',
  paginationValidation,
  assetsController.getAllAssets
);

router.get(
  '/with-models',
  assetsController.getCharactersWithModels
);

router.get(
  '/:characterId',
  characterIdValidation,
  assetsController.getAsset
);

router.delete(
  '/:characterId',
  characterIdValidation,
  assetsController.removeAsset
);

// File upload route (requires multer middleware in controller)
router.post(
  '/upload',
  rateLimit.apiLimiter,
  assetsController.uploadAsset
);

module.exports = router;
