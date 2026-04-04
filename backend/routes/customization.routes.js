const express = require('express');
const router = express.Router();
const Customization = require('../models/Customization.model');
const { auth, adminAuth } = require('../middleware/auth.middleware');
const { body, validationResult } = require('express-validator');

// @route   GET /api/customizations
// @desc    Get all customizations
// @access  Admin
router.get('/',
  auth,
  adminAuth,
  async (req, res) => {
    try {
      const { type, target, page = 1, limit = 20 } = req.query;
      
      const filter = {};
      if (type) filter.type = type;
      if (target) filter.target = target;

      const customizations = await Customization.find(filter)
        .populate('createdBy', 'username name')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit));

      const total = await Customization.countDocuments(filter);

      res.json({
        success: true,
        data: customizations,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
);

// @route   GET /api/customizations/:id
// @desc    Get single customization
// @access  Admin
router.get('/:id',
  auth,
  adminAuth,
  async (req, res) => {
    try {
      const customization = await Customization.findById(req.params.id)
        .populate('createdBy', 'username name');

      if (!customization) {
        return res.status(404).json({
          success: false,
          error: 'التخصيص غير موجود'
        });
      }

      res.json({
        success: true,
        data: customization
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
);

// @route   POST /api/customizations
// @desc    Create customization
// @access  Admin
router.post('/',
  auth,
  adminAuth,
  [
    body('name').isString().notEmpty(),
    body('type').isIn(['theme', 'persona', 'template']),
    body('target').isIn(['admin', 'user', 'both'])
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array()
        });
      }

      const customization = await Customization.create({
        ...req.body,
        createdBy: req.user._id
      });

      res.status(201).json({
        success: true,
        message: 'تم إنشاء التخصيص بنجاح',
        data: customization
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
);

// @route   PUT /api/customizations/:id
// @desc    Update customization
// @access  Admin
router.put('/:id',
  auth,
  adminAuth,
  async (req, res) => {
    try {
      const customization = await Customization.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true, runValidators: true }
      );

      if (!customization) {
        return res.status(404).json({
          success: false,
          error: 'التخصيص غير موجود'
        });
      }

      res.json({
        success: true,
        message: 'تم تحديث التخصيص بنجاح',
        data: customization
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
);

// @route   PUT /api/customizations/:id/colors
// @desc    Update customization colors
// @access  Admin
router.put('/:id/colors',
  auth,
  adminAuth,
  async (req, res) => {
    try {
      const customization = await Customization.findById(req.params.id);
      
      if (!customization) {
        return res.status(404).json({
          success: false,
          error: 'التخصيص غير موجود'
        });
      }

      Object.assign(customization.colors, req.body);
      await customization.save();

      res.json({
        success: true,
        message: 'تم تحديث الألوان بنجاح',
        data: customization.colors
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
);

// @route   PUT /api/customizations/:id/elements
// @desc    Update customization elements
// @access  Admin
router.put('/:id/elements',
  auth,
  adminAuth,
  async (req, res) => {
    try {
      const customization = await Customization.findById(req.params.id);
      
      if (!customization) {
        return res.status(404).json({
          success: false,
          error: 'التخصيص غير موجود'
        });
      }

      Object.assign(customization.elements, req.body);
      await customization.save();

      res.json({
        success: true,
        message: 'تم تحديث العناصر بنجاح',
        data: customization.elements
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
);

// @route   PUT /api/customizations/:id/set-default
// @desc    Set as default customization
// @access  Admin
router.put('/:id/set-default',
  auth,
  adminAuth,
  async (req, res) => {
    try {
      const customization = await Customization.findById(req.params.id);
      
      if (!customization) {
        return res.status(404).json({
          success: false,
          error: 'التخصيص غير موجود'
        });
      }

      // إلغاء التحديد الافتراضي من كل التخصيصات
      await Customization.updateMany(
        { type: customization.type },
        { isDefault: false }
      );

      // تحديد هذا كافتراضي
      customization.isDefault = true;
      await customization.save();

      res.json({
        success: true,
        message: 'تم تحديد التخصيص كافتراضي بنجاح'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
);

// @route   DELETE /api/customizations/:id
// @desc    Delete customization
// @access  Admin
router.delete('/:id',
  auth,
  adminAuth,
  async (req, res) => {
    try {
      const customization = await Customization.findByIdAndDelete(req.params.id);

      if (!customization) {
        return res.status(404).json({
          success: false,
          error: 'التخصيص غير موجود'
        });
      }

      res.json({
        success: true,
        message: 'تم حذف التخصيص بنجاح'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
);

// @route   GET /api/customizations/public/:type
// @desc    Get public customizations by type
// @access  Public
router.get('/public/:type', async (req, res) => {
    try {
      const { type } = req.params;
      const { target = 'both' } = req.query;

      const customizations = await Customization.find({
        type,
        target: { $in: [target, 'both'] },
        isActive: true
      }).select('-icons.customIcons');

      res.json({
        success: true,
        data: customizations
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
);

// @route   GET /api/customizations/default/:type
// @desc    Get default customization by type
// @access  Public
router.get('/default/:type', async (req, res) => {
    try {
      const { type } = req.params;

      let customization = await Customization.findOne({
        type,
        isDefault: true,
        isActive: true
      });

      // إذا لم يكن هناك افتراضي، خذ الأول
      if (!customization) {
        customization = await Customization.findOne({
          type,
          isActive: true
        });
      }

      if (!customization) {
        return res.status(404).json({
          success: false,
          error: 'لا توجد تخصيصات متاحة'
        });
      }

      res.json({
        success: true,
        data: customization
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
);

module.exports = router;