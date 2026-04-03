// Points Routes - SECURE VERSION
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { validate } = require('../middleware/validation.middleware');
const { protect, authorize } = require('../middleware/auth.middleware');
const pointsController = require('../controllers/points.controller');

// Validation
const pointsValidation = [
  body('userId').isMongoId().withMessage('Valid user ID required'),
  body('amount').isNumeric().withMessage('Amount must be a number'),
];

// Routes - All protected and with validation
router.get('/', protect, pointsController.getPoints);

// SECURE: These routes require admin authorization
router.post('/add', protect, authorize('admin', 'owner'), pointsValidation, validate, pointsController.addPoints);
router.post('/deduct', protect, authorize('admin', 'owner'), pointsValidation, validate, pointsController.deductPoints);

module.exports = router;
