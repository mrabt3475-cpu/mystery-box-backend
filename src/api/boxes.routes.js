import express from 'express';
import { authenticate, authorize } from '../common/auth.middleware.js';
import * as boxService from '../modules/boxes/box.service.js';
import { body, param } from 'express-validator';
import { validate } from '../middleware/validation.middleware.js';

const router = express.Router();

// Get all boxes
router.get('/', async (req, res) => {
  try {
    const boxes = await boxService.getBoxes(req.query);
    res.json({ success: true, data: boxes });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Get single box
router.get('/:id', [
  param('id').isMongoId()
], validate, async (req, res) => {
  try {
    const box = await MysteryBox.findById(req.params.id);
    if (!box) {
      return res.status(404).json({ success: false, error: 'Box not found' });
    }
    res.json({ success: true, data: box });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Open box (requires authentication)
router.post('/open', authenticate, [
  body('boxId').isMongoId()
], validate, async (req, res) => {
  try {
    const result = await boxService.openBox(req.user._id, req.body.boxId);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Admin: Create box
router.post('/', authenticate, authorize('admin'), [
  body('name').notEmpty(),
  body('price').isNumeric()
], validate, async (req, res) => {
  try {
    const box = await MysteryBox.create(req.body);
    res.status(201).json({ success: true, data: box });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Admin: Update box
router.put('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const box = await MysteryBox.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json({ success: true, data: box });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

export default router;
