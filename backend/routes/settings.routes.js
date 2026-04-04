const express = require('express');
const router = express.Router();
const Settings = require('../models/Settings.model');
const { auth, adminAuth } = require('../middleware/auth.middleware');
const { body, validationResult } = require('express-validator');

// @route   GET /api/settings
// @desc    Get platform settings
// @access  Public
router.get('/', async (req, res) => {
  try {
    const settings = await Settings.getSettings();
    
    // إخفاء البيانات الحساسة
    const safeSettings = settings.toObject();
    delete safeSettings.payment?.stripeSecret;
    delete safeSettings.payment?.tonSecret;
    delete safeSettings.api?.webhookSecret;
    delete safeSettings.email?.smtpPassword;
    
    res.json({
      success: true,
      data: safeSettings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// @route   PUT /api/settings
// @desc    Update platform settings
// @access  Admin
router.put('/',
  auth,
  adminAuth,
  [
    body('general.siteName').optional().isString(),
    body('design.primaryColor').optional().isString(),
    body('groups.mainChannel').optional().isString(),
    body('userSettings.referralBonus').optional().isNumeric()
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

      const settings = await Settings.updateSettings(req.body, req.user._id);
      
      res.json({
        success: true,
        message: 'تم تحديث الإعدادات بنجاح',
        data: settings
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
);

// @route   PUT /api/settings/design
// @desc    Update design settings
// @access  Admin
router.put('/design',
  auth,
  adminAuth,
  [
    body('primaryColor').optional().isString(),
    body('backgroundColor').optional().isString(),
    body('darkMode').optional().isBoolean()
  ],
  async (req, res) => {
    try {
      const settings = await Settings.getSettings();
      Object.assign(settings.design, req.body);
      settings.updatedBy = req.user._id;
      await settings.save();

      res.json({
        success: true,
        message: 'تم تحديث التصميم بنجاح',
        data: settings.design
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
);

// @route   PUT /api/settings/groups
// @desc    Update groups/channels settings
// @access  Admin
router.put('/groups',
  auth,
  adminAuth,
  [
    body('mainChannel').optional().isString(),
    body('supportGroup').optional().isString(),
    body('welcomeMessage').optional().isString()
  ],
  async (req, res) => {
    try {
      const settings = await Settings.getSettings();
      Object.assign(settings.groups, req.body);
      settings.updatedBy = req.user._id;
      await settings.save();

      res.json({
        success: true,
        message: 'تم تحديث إعدادات المجموعات بنجاح',
        data: settings.groups
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
);

// @route   PUT /api/settings/user
// @desc    Update user settings
// @access  Admin
router.put('/user',
  auth,
  adminAuth,
  [
    body('requirePhone').optional().isBoolean(),
    body('allowReferrals').optional().isBoolean(),
    body('maxBoxesPerDay').optional().isNumeric()
  ],
  async (req, res) => {
    try {
      const settings = await Settings.getSettings();
      Object.assign(settings.userSettings, req.body);
      settings.updatedBy = req.user._id;
      await settings.save();

      res.json({
        success: true,
        message: 'تم تحديث إعدادات المستخدمين بنجاح',
        data: settings.userSettings
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
);

// @route   PUT /api/settings/payment
// @desc    Update payment settings
// @access  Admin
router.put('/payment',
  auth,
  adminAuth,
  [
    body('enableTON').optional().isBoolean(),
    body('enableStripe').optional().isBoolean(),
    body('minDeposit').optional().isNumeric()
  ],
  async (req, res) => {
    try {
      const settings = await Settings.getSettings();
      Object.assign(settings.payment, req.body);
      settings.updatedBy = req.user._id;
      await settings.save();

      res.json({
        success: true,
        message: 'تم تحديث إعدادات الدفع بنجاح',
        data: settings.payment
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
);

// @route   PUT /api/settings/maintenance
// @desc    Toggle maintenance mode
// @access  Admin
router.put('/maintenance',
  auth,
  adminAuth,
  [
    body('enabled').isBoolean(),
    body('message').optional().isString()
  ],
  async (req, res) => {
    try {
      const settings = await Settings.getSettings();
      settings.maintenance.enabled = req.body.enabled;
      if (req.body.message) {
        settings.maintenance.message = req.body.message;
      }
      settings.updatedBy = req.user._id;
      await settings.save();

      res.json({
        success: true,
        message: req.body.enabled ? 'تم تفعيل وضع الصيانة' : 'تم إلغاء وضع الصيانة',
        data: settings.maintenance
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
);

// @route   GET /api/settings/public
// @desc    Get public settings (for frontend)
// @access  Public
router.get('/public', async (req, res) => {
  try {
    const settings = await Settings.getSettings();
    
    const publicSettings = {
      general: {
        siteName: settings.general.siteName,
        siteNameAr: settings.general.siteNameAr,
        logo: settings.general.logo,
        language: settings.general.language
      },
      design: settings.design,
      groups: {
        mainChannel: settings.groups.mainChannel,
        supportGroup: settings.groups.supportGroup,
        winnersChannel: settings.groups.winnersChannel
      },
      social: settings.social
    };

    res.json({
      success: true,
      data: publicSettings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;