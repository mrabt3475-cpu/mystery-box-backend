const express = require('express');
const router = express.Router();
const ServiceService = require('../services/service.service');
const { auth } = require('../middleware/auth.middleware');

// Get all services
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 12, type, search } = req.query;
    const result = await ServiceService.getServices({ type, search }, parseInt(page), parseInt(limit));
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get user's services
router.get('/my', auth, async (req, res) => {
  try {
    const services = await ServiceService.getUserServices(req.user.id);
    res.json({ success: true, data: services });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get service by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const service = await ServiceService.getServiceById(req.params.id);
    if (!service) return res.status(404).json({ success: false, error: 'الخدمة غير موجودة' });
    res.json({ success: true, data: service });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create service
router.post('/', auth, async (req, res) => {
  try {
    const service = await ServiceService.createService(req.user.id, req.body);
    res.status(201).json({ success: true, data: service });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Join service
router.post('/:id/join', auth, async (req, res) => {
  try {
    const service = await ServiceService.joinService(req.params.id, req.user.id);
    res.json({ success: true, message: 'تم الانضمام بنجاح', data: service });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Leave service
router.post('/:id/leave', auth, async (req, res) => {
  try {
    await ServiceService.leaveService(req.params.id, req.user.id);
    res.json({ success: true, message: 'تم المغادرة بنجاح' });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

module.exports = router;
