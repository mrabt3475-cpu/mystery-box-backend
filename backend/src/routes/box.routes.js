// Box Routes
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { validate } = require('../middleware/validation.middleware');
const { protect } = require('../middleware/auth.middleware');
const boxController = require('../controllers/box.controller');

// Routes
router.get('/', boxController.getBoxes);
router.get('/:id', boxController.getBox);
router.post('/:id/open', protect, boxController.openBox);
router.get('/:id/verify/:hash', boxController.verifyResult);

module.exports = router;
