// Box Routes
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { validate } = require('../middleware/validation.middleware');
const { protect, authorize } = require('../middleware/auth.middleware');
const boxController = require('../controllers/box.controller');

router.get('/', boxController.getBoxes);
router.get('/:id', boxController.getBox);
router.post('/:id/open', protect, boxController.openBox);
router.post('/', protect, authorize('admin', 'moderator'), boxController.createBox);
router.put('/:id', protect, authorize('admin', 'moderator'), boxController.updateBox);

module.exports = router;
