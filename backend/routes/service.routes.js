const express = require('express');
const router = express.Router();
const Service = require('../models/Service.model');
const User = require('../models/user.model');
const { auth } = require('../middleware/auth.middleware');

// Get all services
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 12, type, search } = req.query;
    const query = { status: 'active' };
    if (type) query.serviceType = type;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const services = await Service.find(query)
      .populate('owner', 'name username avatar')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Service.countDocuments(query);

    res.json({
      success: true,
      data: {
        services,
        pagination: { page: parseInt(page), limit: parseInt(limit), total, totalPages: Math.ceil(total / limit) }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get my services
router.get('/my', auth, async (req, res) => {
  try {
    const services = await Service.find({ owner: req.user.id })
      .sort({ createdAt: -1 });
    res.json({ success: true, data: services });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get service by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const service = await Service.findById(req.params.id)
      .populate('owner', 'name username avatar')
      .populate('members.user', 'name username avatar');
    
    if (!service) {
      return res.status(404).json({ success: false, error: 'الخدمة غير موجودة' });
    }

    // Increment views
    service.stats.views += 1;
    await service.save();

    res.json({ success: true, data: service });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create service
router.post('/', auth, async (req, res) => {
  try {
    const { name, description, serviceType, cost, pointsRequired, joinMode, settings } = req.body;
    
    const service = await Service.create({
      name,
      description,
      serviceType,
      owner: req.user.id,
      cost,
      pointsRequired,
      joinMode,
      settings,
      members: [{ user: req.user.id, role: 'owner' }]
    });

    res.status(201).json({ success: true, data: service });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Join service
router.post('/:id/join', auth, async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, error: 'الخدمة غير موجودة' });
    }

    const isMember = service.members.some(m => m.user.toString() === req.user.id);
    if (isMember) {
      return res.status(400).json({ success: false, error: 'أنت عضو بالفعل' });
    }

    const user = await User.findById(req.user.id);
    
    // Check points required
    if (service.pointsRequired > 0 && user.pointsBalance < service.pointsRequired) {
      return res.status(400).json({ success: false, error: 'رصيدك غير كافٍ' });
    }

    // Deduct points
    if (service.pointsRequired > 0) {
      user.pointsBalance -= service.pointsRequired;
      await user.save();
    }

    service.members.push({ user: req.user.id, role: 'member' });
    await service.save();

    res.json({ success: true, message: 'تم الانضمام بنجاح' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Leave service
router.post('/:id/leave', auth, async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, error: 'الخدمة غير موجودة' });
    }

    service.members = service.members.filter(m => m.user.toString() !== req.user.id);
    await service.save();

    res.json({ success: true, message: 'تم المغادرة بنجاح' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update service
router.put('/:id', auth, async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, error: 'الخدمة غير موجودة' });
    }

    if (service.owner.toString() !== req.user.id) {
      return res.status(403).json({ success: false, error: 'غير مصرح' });
    }

    Object.assign(service, req.body);
    await service.save();

    res.json({ success: true, data: service });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete service
router.delete('/:id', auth, async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, error: 'الخدمة غير موجودة' });
    }

    if (service.owner.toString() !== req.user.id) {
      return res.status(403).json({ success: false, error: 'غير مصرح' });
    }

    await Service.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'تم حذف الخدمة' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
