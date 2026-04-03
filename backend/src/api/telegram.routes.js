import { Router } from 'express';
import { 
  verifyTelegramLogin, 
  telegramLogin,
  linkTelegramAccount,
  unlinkTelegramAccount
} from '../services/telegram.service.js';
import { authenticate } from '../../common/auth.middleware.js';

const router = Router();

// Telegram Login - Get initData for widget
router.get('/widget-config', (req, res) => {
  res.json({
    bot_username: process.env.TELEGRAM_BOT_USERNAME,
    auth_url: process.env.CLIENT_URL + '/auth/telegram/callback'
  });
});

// Login with Telegram
router.post('/login', async (req, res) => {
  try {
    const { initData } = req.body;
    
    if (!initData) {
      return res.status(400).json({ 
        success: false, 
        error: 'initData is required' 
      });
    }
    
    // Verify Telegram data
    const verification = await verifyTelegramLogin(initData);
    
    if (!verification.valid) {
      return res.status(401).json({ 
        success: false, 
        error: verification.error 
      });
    }
    
    // Login or register
    const result = await telegramLogin(verification.user);
    
    if (!result.success) {
      return res.status(400).json(result);
    }
    
    res.json(result);
  } catch (error) {
    console.error('Telegram login error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Link Telegram to existing account
router.post('/link', authenticate, async (req, res) => {
  try {
    const { initData } = req.body;
    
    if (!initData) {
      return res.status(400).json({ 
        success: false, 
        error: 'initData is required' 
      });
    }
    
    const verification = await verifyTelegramLogin(initData);
    
    if (!verification.valid) {
      return res.status(401).json({ 
        success: false, 
        error: verification.error 
      });
    }
    
    const result = await linkTelegramAccount(req.user._id, verification.user);
    res.json(result);
  } catch (error) {
    console.error('Link Telegram error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Unlink Telegram account
router.post('/unlink', authenticate, async (req, res) => {
  try {
    const result = await unlinkTelegramAccount(req.user._id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get Telegram connection status
router.get('/status', authenticate, async (req, res) => {
  try {
    const TelegramUser = (await import('../telegramUser.model.js')).default;
    const telegramUser = await TelegramUser.findOne({ user: req.user._id });
    
    res.json({
      success: true,
      linked: !!telegramUser,
      telegramId: telegramUser?.telegramId,
      username: telegramUser?.username,
      notificationsEnabled: telegramUser?.notificationsEnabled ?? true
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
