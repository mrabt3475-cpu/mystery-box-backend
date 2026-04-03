const express = require('express');
const router = express.Router();
const ServiceService = require('../services/service.service');
const { auth } = require('../middleware/auth.middleware');
const { catchAsync } = require('../middleware/errorHandler.middleware');
const { validators } = require('../utils/validation');
const { NotFoundError, ValidationError } = require('../utils/AppError');
const { formatSuccess, formatPaginated } = require('../utils/responseFormatter');

// Get all services with pagination
router.get('/', auth, catchAsync(async (req, res) => {
  const { page = 1, limit = 12, type, search } = req.query;
  
  const result = await ServiceService.getServices(
    { type, search },
    parseInt(page),
    parseInt(limit)
  );
  
  res.json(formatPaginated(result.services, result.pagination));
}));

// Get user's services
router.get('/my', auth, catchAsync(async (req, res) => {
  const services = await ServiceService.getUserServices(req.user.id);
  res.json(formatSuccess(services));
}));

// Get service by ID
router.get('/:id', auth, validators.isObjectId('id'), catchAsync(async (req, res) => {
  const service = await ServiceService.getServiceById(req.params.id);
  
  if (!service) {
    throw new NotFoundError('الخدمة');
  }
  
  res.json(formatSuccess(service));
}));

// Create service
router.post('/', auth, catchAsync(async (req, res) => {
  const service = await ServiceService.createService(req.user.id, req.body);
  res.status(201).json(formatSuccess(service, '✅ تم إنشاء الخدمة'));
}));

// Join service
router.post('/:id/join', auth, validators.isObjectId('id'), catchAsync(async (req, res) => {
  const service = await ServiceService.joinService(req.params.id, req.user.id);
  res.json(formatSuccess(service, '✅ تم الانضمام'));
}));

// Leave service
router.post('/:id/leave', auth, validators.isObjectId('id'), catchAsync(async (req, res) => {
  await ServiceService.leaveService(req.params.id, req.user.id);
  res.json(formatSuccess(null, '✅ تم المغادرة'));
}));

module.exports = router;
