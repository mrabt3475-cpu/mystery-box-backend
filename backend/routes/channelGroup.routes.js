const express = require('express');
const router = express.Router();
const ChannelGroup = require('../models/ChannelGroup.model');
const { auth, adminAuth, channelOwnerAuth, channelModeratorAuth } = require('../middleware/auth.middleware');
const { body, validationResult } = require('express-validator');

// Middleware للتحقق من ملكية القناة
const checkChannelOwnership = async (req, res, next) => {
  try {
    const channel = await ChannelGroup.findById(req.params.id);
    if (!channel) {
      return res.status(404).json({ success: false, error: 'القناة غير موجودة' });
    }
    
    const isOwner = channel.owner.toString() === req.user._id.toString();
    const isModerator = channel.moderators.some(m => m.user.toString() === req.user._id.toString());
    const isAdmin = req.user.role === 'admin';
    
    if (!isOwner && !isModerator && !isAdmin) {
      return res.status(403).json({ success: false, error: 'ليس لديك صلاحية' });
    }
    
    req.channel = channel;
    next();
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ========================
// 📋 المسارات الأساسية
// ========================

// @route   GET /api/channel-groups
// @desc    Get all channel groups (Admin)
// @access  Admin
router.get('/', auth, adminAuth, async (req, res) => {
  try {
    const { type, status, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (type) filter.type = type;
    if (status) filter.status = status;

    const groups = await ChannelGroup.find(filter)
      .populate('owner', 'username name')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await ChannelGroup.countDocuments(filter);
    res.json({ success: true, data: groups, pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// @route   GET /api/channel-groups/my
// @desc    Get user's channel groups
// @access  Private
router.get('/my', auth, async (req, res) => {
  try {
    const groups = await ChannelGroup.find({
      $or: [
        { owner: req.user._id },
        { 'moderators.user': req.user._id }
      ]
    }).populate('owner', 'username name');

    res.json({ success: true, data: groups });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// @route   GET /api/channel-groups/:id
// @desc    Get single channel group
// @access  Private (owner/moderator)
router.get('/:id', auth, checkChannelOwnership, async (req, res) => {
  try {
    res.json({ success: true, data: req.channel });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// @route   POST /api/channel-groups
// @desc    Create channel group
// @access  Private
router.post('/', auth, [
  body('name').isString().notEmpty(),
  body('type').isIn(['channel', 'group', 'supergroup']),
  body('chatId').isString().notEmpty(),
  body('title').isString().notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const existing = await ChannelGroup.findOne({ chatId: req.body.chatId });
    if (existing) {
      return res.status(400).json({ success: false, error: 'هذه المجموعة موجودة بالفعل' });
    }

    const group = await ChannelGroup.create({ ...req.body, owner: req.user._id });
    res.status(201).json({ success: true, message: 'تم إضافة المجموعة بنجاح', data: group });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// @route   PUT /api/channel-groups/:id
// @desc    Update channel group
// @access  Owner/Admin
router.put('/:id', auth, checkChannelOwnership, async (req, res) => {
  try {
    const group = await ChannelGroup.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true, runValidators: true });
    res.json({ success: true, message: 'تم تحديث المجموعة بنجاح', data: group });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// @route   DELETE /api/channel-groups/:id
// @desc    Delete channel group
// @access  Owner/Admin
router.delete('/:id', auth, checkChannelOwnership, async (req, res) => {
  try {
    await ChannelGroup.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'تم حذف المجموعة بنجاح' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ========================
// 🎨 تخصيص التصميم
// ========================

// @route   PUT /api/channel-groups/:id/design
// @desc    Update group design
// @access  Owner/Moderator
router.put('/:id/design', auth, checkChannelOwnership, async (req, res) => {
  try {
    Object.assign(req.channel.design, req.body);
    await req.channel.save();
    res.json({ success: true, message: 'تم تحديث التصميم بنجاح', data: req.channel.design });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// @route   PUT /api/channel-groups/:id/design/background
// @desc    Update background settings
// @access  Owner/Moderator
router.put('/:id/design/background', auth, checkChannelOwnership, [
  body('backgroundColor').optional().isString(),
  body('backgroundImage').optional().isString(),
  body('backgroundEffect').optional().isIn(['none', 'particles', 'gradient', 'stars', 'matrix', 'fire', 'snow'])
], async (req, res) => {
  try {
    const { backgroundColor, backgroundImage, backgroundEffect, coverImage, coverVideo } = req.body;
    
    if (backgroundColor) req.channel.design.backgroundColor = backgroundColor;
    if (backgroundImage) req.channel.design.backgroundImage = backgroundImage;
    if (backgroundEffect) req.channel.design.backgroundEffect = backgroundEffect;
    if (coverImage) req.channel.design.coverImage = coverImage;
    if (coverVideo) req.channel.design.coverVideo = coverVideo;
    
    await req.channel.save();
    res.json({ success: true, message: 'تم تحديث الخلفية بنجاح', data: req.channel.design });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// @route   PUT /api/channel-groups/:id/design/colors
// @desc    Update color scheme
// @access  Owner/Moderator
router.put('/:id/design/colors', auth, checkChannelOwnership, async (req, res) => {
  try {
    const { textColor, textMutedColor, accentColor, borderRadius } = req.body;
    
    if (textColor) req.channel.design.textColor = textColor;
    if (textMutedColor) req.channel.design.textMutedColor = textMutedColor;
    if (accentColor) req.channel.design.accentColor = accentColor;
    if (borderRadius) req.channel.design.borderRadius = borderRadius;
    
    await req.channel.save();
    res.json({ success: true, message: 'تم تحديث الألوان بنجاح', data: req.channel.design });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ========================
// 🎭 الشخصيات ثلاثية الأبعاد
// ========================

// @route   PUT /api/channel-groups/:id/characters
// @desc    Update characters settings
// @access  Owner/Moderator
router.put('/:id/characters', auth, checkChannelOwnership, async (req, res) => {
  try {
    Object.assign(req.channel.characters, req.body);
    await req.channel.save();
    res.json({ success: true, message: 'تم تحديث الشخصيات بنجاح', data: req.channel.characters });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// @route   PUT /api/channel-groups/:id/characters/main
// @desc    Update main character
// @access  Owner/Moderator
router.put('/:id/characters/main', auth, checkChannelOwnership, [
  body('type').optional().isIn(['robot', 'anime', 'human', 'animal', 'custom', 'none'])
], async (req, res) => {
  try {
    const { type, name, model3d, image, animation, colors, position, showOn } = req.body;
    
    if (type) req.channel.characters.mainCharacter.type = type;
    if (name) req.channel.characters.mainCharacter.name = name;
    if (model3d) req.channel.characters.mainCharacter.model3d = model3d;
    if (image) req.channel.characters.mainCharacter.image = image;
    if (animation) req.channel.characters.mainCharacter.animation = animation;
    if (colors) Object.assign(req.channel.characters.mainCharacter.colors, colors);
    if (position) Object.assign(req.channel.characters.mainCharacter.position, position);
    if (showOn) Object.assign(req.channel.characters.mainCharacter.showOn, showOn);
    
    req.channel.characters.enabled = true;
    await req.channel.save();
    
    res.json({ success: true, message: 'تم تحديث الشخصية الرئيسية بنجاح', data: req.channel.characters.mainCharacter });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// @route   PUT /api/channel-groups/:id/characters/welcome
// @desc    Update welcome character
// @access  Owner/Moderator
router.put('/characters/welcome', auth, checkChannelOwnership, async (req, res) => {
  try {
    const { type, image, animation, message } = req.body;
    
    if (type) req.channel.characters.welcomeCharacter.type = type;
    if (image) req.channel.characters.welcomeCharacter.image = image;
    if (animation) req.channel.characters.welcomeCharacter.animation = animation;
    if (message) req.channel.characters.welcomeCharacter.message = message;
    
    await req.channel.save();
    res.json({ success: true, message: 'تم تحديث شخصية الترحيب بنجاح', data: req.channel.characters.welcomeCharacter });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// @route   PUT /api/channel-groups/:id/characters/colors
// @desc    Update character colors
// @access  Owner/Moderator
router.put('/:id/characters/colors', auth, checkChannelOwnership, async (req, res) => {
  try {
    const { primary, secondary, skin } = req.body;
    
    if (primary) req.channel.characters.mainCharacter.colors.primary = primary;
    if (secondary) req.channel.characters.mainCharacter.colors.secondary = secondary;
    if (skin) req.channel.characters.mainCharacter.colors.skin = skin;
    
    await req.channel.save();
    res.json({ success: true, message: 'تم تحديث ألوان الشخصية بنجاح', data: req.channel.characters.mainCharacter.colors });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// @route   PUT /api/channel-groups/:id/characters/position
// @desc    Update character position
// @access  Owner/Moderator
router.put('/:id/characters/position', auth, checkChannelOwnership, async (req, res) => {
  try {
    const { x, y, scale } = req.body;
    
    if (x !== undefined) req.channel.characters.mainCharacter.position.x = x;
    if (y !== undefined) req.channel.characters.mainCharacter.position.y = y;
    if (scale !== undefined) req.channel.characters.mainCharacter.position.scale = scale;
    
    await req.channel.save();
    res.json({ success: true, message: 'تم تحديث موضع الشخصية بنجاح', data: req.channel.characters.mainCharacter.position });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ========================
// ✨ التأثيرات والأنميشن
// ========================

// @route   PUT /api/channel-groups/:id/animations
// @desc    Update animations settings
// @access  Owner/Moderator
router.put('/:id/animations', auth, checkChannelOwnership, async (req, res) => {
  try {
    Object.assign(req.channel.animations, req.body);
    await req.channel.save();
    res.json({ success: true, message: 'تم تحديث الأنميشن بنجاح', data: req.channel.animations });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// @route   PUT /api/channel-groups/:id/animations/box
// @desc    Update box open animation
// @access  Owner/Moderator
router.put('/:id/animations/box', auth, checkChannelOwnership, [
  body('boxOpenAnimation').isIn(['default', 'shake', 'spin', 'explode', 'glow', 'flip', 'zoom'])
], async (req, res) => {
  try {
    req.channel.animations.boxOpenAnimation = req.body.boxOpenAnimation;
    await req.channel.save();
    res.json({ success: true, message: 'تم تحديث أنميشن فتح الصندوق بنجاح', data: req.channel.animations.boxOpenAnimation });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// @route   PUT /api/channel-groups/:id/animations/win
// @desc    Update win animation
// @access  Owner/Moderator
router.put('/:id/animations/win', auth, checkChannelOwnership, [
  body('winAnimation').isIn(['default', 'confetti', 'fireworks', 'glow', 'pulse', 'bounce'])
], async (req, res) => {
  try {
    req.channel.animations.winAnimation = req.body.winAnimation;
    await req.channel.save();
    res.json({ success: true, message: 'تم تحديث أنميشن الفوز بنجاح', data: req.channel.animations.winAnimation });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// @route   PUT /api/channel-groups/:id/animations/effects
// @desc    Update special effects
// @access  Owner/Moderator
router.put('/:id/animations/effects', auth, checkChannelOwnership, async (req, res) => {
  try {
    const { particles, glow, shadows, blur } = req.body;
    
    if (particles !== undefined) req.channel.animations.specialEffects.particles = particles;
    if (glow !== undefined) req.channel.animations.specialEffects.glow = glow;
    if (shadows !== undefined) req.channel.animations.specialEffects.shadows = shadows;
    if (blur !== undefined) req.channel.animations.specialEffects.blur = blur;
    
    await req.channel.save();
    res.json({ success: true, message: 'تم تحديث المؤثرات بنجاح', data: req.channel.animations.specialEffects });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ========================
// 🖼️ الوسائط
// ========================

// @route   PUT /api/channel-groups/:id/media
// @desc    Update media settings
// @access  Owner/Moderator
router.put('/:id/media', auth, checkChannelOwnership, async (req, res) => {
  try {
    Object.assign(req.channel.media, req.body);
    await req.channel.save();
    res.json({ success: true, message: 'تم تحديث الوسائط بنجاح', data: req.channel.media });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// @route   PUT /api/channel-groups/:id/media/rarity
// @desc    Update rarity images
// @access  Owner/Moderator
router.put('/:id/media/rarity', auth, checkChannelOwnership, async (req, res) => {
  try {
    const { common, uncommon, rare, epic, legendary, mythic } = req.body;
    
    if (common) req.channel.media.rarityImages.common = common;
    if (uncommon) req.channel.media.rarityImages.uncommon = uncommon;
    if (rare) req.channel.media.rarityImages.rare = rare;
    if (epic) req.channel.media.rarityImages.epic = epic;
    if (legendary) req.channel.media.rarityImages.legendary = legendary;
    if (mythic) req.channel.media.rarityImages.mythic = mythic;
    
    await req.channel.save();
    res.json({ success: true, message: 'تم تحديث صور الندرة بنجاح', data: req.channel.media.rarityImages });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// @route   PUT /api/channel-groups/:id/media/sounds
// @desc    Update sounds
// @access  Owner/Moderator
router.put('/:id/media/sounds', auth, checkChannelOwnership, async (req, res) => {
  try {
    const { boxOpen, win, levelUp, notification, soundEnabled, volume } = req.body;
    
    if (boxOpen) req.channel.media.sounds.boxOpen = boxOpen;
    if (win) req.channel.media.sounds.win = win;
    if (levelUp) req.channel.media.sounds.levelUp = levelUp;
    if (notification) req.channel.media.sounds.notification = notification;
    if (soundEnabled !== undefined) req.channel.media.soundEnabled = soundEnabled;
    if (volume !== undefined) req.channel.media.volume = volume;
    
    await req.channel.save();
    res.json({ success: true, message: 'تم تحديث الأصوات بنجاح', data: req.channel.media.sounds });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ========================
// 👤 واجهة المستخدم
// ========================

// @route   PUT /api/channel-groups/:id/ui
// @desc    Update UI settings
// @access  Owner/Moderator
router.put('/:id/ui', auth, checkChannelOwnership, async (req, res) => {
  try {
    Object.assign(req.channel.ui, req.body);
    await req.channel.save();
    res.json({ success: true, message: 'تم تحديث الواجهة بنجاح', data: req.channel.ui });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// @route   PUT /api/channel-groups/:id/ui/styles
// @desc    Update UI styles
// @access  Owner/Moderator
router.put('/:id/ui/styles', auth, checkChannelOwnership, async (req, res) => {
  try {
    const { cardStyle, buttonStyle, boxStyle, notificationStyle, profileStyle } = req.body;
    
    if (cardStyle) req.channel.ui.cardStyle = cardStyle;
    if (buttonStyle) req.channel.ui.buttonStyle = buttonStyle;
    if (boxStyle) req.channel.ui.boxStyle = boxStyle;
    if (notificationStyle) req.channel.ui.notificationStyle = notificationStyle;
    if (profileStyle) req.channel.ui.profileStyle = profileStyle;
    
    await req.channel.save();
    res.json({ success: true, message: 'تم تحديث الأنماط بنجاح', data: req.channel.ui });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ========================
// 🔤 الرسائل
// ========================

// @route   PUT /api/channel-groups/:id/messages
// @desc    Update messages
// @access  Owner/Moderator
router.put('/:id/messages', auth, checkChannelOwnership, async (req, res) => {
  try {
    Object.assign(req.channel.messages, req.body);
    await req.channel.save();
    res.json({ success: true, message: 'تم تحديث الرسائل بنجاح', data: req.channel.messages });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// @route   PUT /api/channel-groups/:id/messages/welcome
// @desc    Update welcome message
// @access  Owner/Moderator
router.put('/:id/messages/welcome', auth, checkChannelOwnership, async (req, res) => {
  try {
    const { enabled, title, message, image, sticker, buttons } = req.body;
    
    if (enabled !== undefined) req.channel.messages.welcome.enabled = enabled;
    if (title) req.channel.messages.welcome.title = title;
    if (message) req.channel.messages.welcome.message = message;
    if (image) req.channel.messages.welcome.image = image;
    if (sticker) req.channel.messages.welcome.sticker = sticker;
    if (buttons) req.channel.messages.welcome.buttons = buttons;
    
    await req.channel.save();
    res.json({ success: true, message: 'تم تحديث رسالة الترحيب بنجاح', data: req.channel.messages.welcome });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// @route   PUT /api/channel-groups/:id/messages/win
// @desc    Update win message
// @access  Owner/Moderator
router.put('/:id/messages/win', auth, checkChannelOwnership, async (req, res) => {
  try {
    const { enabled, template, showInChannel, announceChannel } = req.body;
    
    if (enabled !== undefined) req.channel.messages.winMessage.enabled = enabled;
    if (template) req.channel.messages.winMessage.template = template;
    if (showInChannel !== undefined) req.channel.messages.winMessage.showInChannel = showInChannel;
    if (announceChannel) req.channel.messages.winMessage.announceChannel = announceChannel;
    
    await req.channel.save();
    res.json({ success: true, message: 'تم تحديث رسالة الفوز بنجاح', data: req.channel.messages.winMessage });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ========================
// 🔒 الأمان
// ========================

// @route   PUT /api/channel-groups/:id/security
// @desc    Update security settings
// @access  Owner/Admin
router.put('/:id/security', auth, checkChannelOwnership, async (req, res) => {
  try {
    Object.assign(req.channel.security, req.body);
    await req.channel.save();
    res.json({ success: true, message: 'تم تحديث إعدادات الأمان بنجاح', data: req.channel.security });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ========================
// 🎁 المكافآت
// ========================

// @route   PUT /api/channel-groups/:id/rewards
// @desc    Update rewards settings
// @access  Owner/Moderator
router.put('/:id/rewards', auth, checkChannelOwnership, async (req, res) => {
  try {
    Object.assign(req.channel.rewards, req.body);
    await req.channel.save();
    res.json({ success: true, message: 'تم تحديث المكافآت بنجاح', data: req.channel.rewards });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ========================
// 🤖 المشرفون
// ========================

// @route   POST /api/channel-groups/:id/moderators
// @desc    Add moderator
// @access  Owner
router.post('/:id/moderators', auth, checkChannelOwnership, async (req, res) => {
  try {
    const { userId, permissions } = req.body;
    
    const existingMod = req.channel.moderators.find(m => m.user.toString() === userId);
    if (existingMod) {
      return res.status(400).json({ success: false, error: 'هذا المستخدم مشرف بالفعل' });
    }
    
    req.channel.moderators.push({ user: userId, permissions: permissions || [] });
    await req.channel.save();
    
    res.json({ success: true, message: 'تم إضافة المشرف بنجاح', data: req.channel.moderators });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// @route   DELETE /api/channel-groups/:id/moderators/:userId
// @desc    Remove moderator
// @access  Owner
router.delete('/:id/moderators/:userId', auth, checkChannelOwnership, async (req, res) => {
  try {
    req.channel.moderators = req.channel.moderators.filter(m => m.user.toString() !== req.params.userId);
    await req.channel.save();
    
    res.json({ success: true, message: 'تم إزالة المشرف بنجاح', data: req.channel.moderators });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ========================
// 📢 العامة
// ========================

// @route   GET /api/channel-groups/public/list
// @desc    Get public channel groups
// @access  Public
router.get('/public/list', async (req, res) => {
  try {
    const groups = await ChannelGroup.find({ status: 'active' })
      .select('name type title description design inviteLink stats');
    res.json({ success: true, data: groups });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// @route   GET /api/channel-groups/public/:id
// @desc    Get public channel group (for users)
// @access  Public
router.get('/public/:id', async (req, res) => {
  try {
    const group = await ChannelGroup.findById(req.params.id)
      .select('name type title description design ui messages notifications stats');
    
    if (!group || group.status !== 'active') {
      return res.status(404).json({ success: false, error: 'القناة غير موجودة' });
    }
    
    res.json({ success: true, data: group });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;