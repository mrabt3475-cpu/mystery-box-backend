import { Router } from 'express';
import { getBoxes, openBox } from '../boxes/box.service.js';
import { authenticate } from '../../common/auth.middleware.js';

const router = Router();

// Get all boxes
router.get('/', async (req, res) => {
  try {
    const { type, featured } = req.query;
    const boxes = await getBoxes({ type, featured });
    res.json({ success: true, data: boxes });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Get box by ID
router.get('/:id', async (req, res) => {
  try {
    const boxes = await getBoxes();
    const box = boxes.find(b => b._id.toString() === req.params.id);
    if (!box) {
      return res.status(404).json({ success: false, error: 'Box not found' });
    }
    res.json({ success: true, data: box });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Open a box
router.post('/open', authenticate, async (req, res) => {
  try {
    const { boxId } = req.body;
    const result = await openBox(req.user._id, boxId);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

export default router;
