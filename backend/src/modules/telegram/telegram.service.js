import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import TelegramUser from './telegramUser.model.js';
import User from '../user/user.model.js';

const JWT_SECRET = process.env.JWT_SECRET;
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

// Generate login hash for Telegram
const generateLoginHash = (authDate, secret) => {
  const data = `${authDate}${secret}`;
  return crypto.createHash('sha256').update(data).digest('hex');
};

// Verify Telegram login data
const verifyTelegramLogin = async (initData) => {
  try {
    // Parse initData from Telegram
    const params = new URLSearchParams(initData);
    const hash = params.get('hash');
    const authDate = params.get('auth_date');
    
    // Remove hash from data to verify
    params.delete('hash');
    
    // Create verification string
    const dataCheckString = Array.from(params.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');
    
    // Get bot token from env
    const secretKey = crypto.createHash('sha256')
      .update(TELEGRAM_BOT_TOKEN)
      .digest('hex');
    
    // Calculate expected hash
    const expectedHash = crypto.createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex');
    
    // Verify hash
    if (hash !== expectedHash) {
      return { valid: false, error: 'Invalid hash' };
    }
    
    // Check auth date (not older than 24 hours)
    const maxAge = 24 * 60 * 60; // 24 hours
    if (Date.now() / 1000 - parseInt(authDate) > maxAge) {
      return { valid: false, error: 'Data expired' };
    }
    
    // Extract user data
    const userData = JSON.parse(params.get('user'));
    
    return {
      valid: true,
      user: {
        telegramId: String(userData.id),
        username: userData.username,
        firstName: userData.first_name,
        lastName: userData.last_name,
        photoUrl: userData.photo_url,
        authDate: new Date(parseInt(authDate) * 1000)
      }
    };
  } catch (error) {
    console.error('Telegram login verification error:', error);
    return { valid: false, error: error.message };
  }
};

// Login or register with Telegram
const telegramLogin = async (telegramData) => {
  try {
    // Find or create Telegram user
    let telegramUser = await TelegramUser.findOne({
      telegramId: telegramData.telegramId
    });
    
    let user;
    
    if (telegramUser) {
      // Update last interaction
      telegramUser.lastInteraction = new Date();
      await telegramUser.save();
      
      // Get associated user
      user = await User.findById(telegramUser.user);
    } else {
      // Check if user exists by username or create new
      user = await User.findOne({ username: telegramData.username });
      
      if (!user) {
        // Create new user
        user = await User.create({
          name: `${telegramData.firstName} ${telegramData.lastName || ''}`.trim(),
          username: telegramData.username || `tg_${telegramData.telegramId}`,
          email: `${telegramData.telegramId}@telegram.user`,
          password: crypto.randomBytes(32).toString('hex'), // Random password
          role: 'user',
          isVerified: true,
          wallet: { balance: 0, points: 0 },
          telegram: { telegramId: telegramData.telegramId }
        });
      }
      
      // Create Telegram user link
      telegramUser = await TelegramUser.create({
        user: user._id,
        telegramId: telegramData.telegramId,
        username: telegramData.username,
        firstName: telegramData.firstName,
        lastName: telegramData.lastName,
        photoUrl: telegramData.photoUrl,
        authDate: telegramData.authDate,
        isVerified: true
      });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, telegramId: telegramData.telegramId },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    return {
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
        wallet: user.wallet,
        telegramId: telegramData.telegramId
      }
    };
  } catch (error) {
    console.error('Telegram login error:', error);
    return { success: false, error: error.message };
  }
};

// Link existing account to Telegram
const linkTelegramAccount = async (userId, telegramData) => {
  try {
    // Check if Telegram ID already linked
    const existing = await TelegramUser.findOne({
      telegramId: telegramData.telegramId
    });
    
    if (existing && existing.user.toString() !== userId) {
      return { success: false, error: 'This Telegram account is already linked to another user' };
    }
    
    // Update or create Telegram user
    let telegramUser = await TelegramUser.findOne({ user: userId });
    
    if (telegramUser) {
      telegramUser.telegramId = telegramData.telegramId;
      telegramUser.username = telegramData.username;
      telegramUser.firstName = telegramData.firstName;
      telegramUser.lastName = telegramData.lastName;
      telegramUser.photoUrl = telegramData.photoUrl;
      telegramUser.isVerified = true;
      await telegramUser.save();
    } else {
      telegramUser = await TelegramUser.create({
        user: userId,
        telegramId: telegramData.telegramId,
        username: telegramData.username,
        firstName: telegramData.firstName,
        lastName: telegramData.lastName,
        photoUrl: telegramData.photoUrl,
        authDate: telegramData.authDate,
        isVerified: true
      });
    }
    
    // Update user model
    await User.findByIdAndUpdate(userId, {
      'telegram.telegramId': telegramData.telegramId,
      'telegram.isLinked': true
    });
    
    return { success: true, message: 'Telegram account linked successfully' };
  } catch (error) {
    console.error('Link Telegram error:', error);
    return { success: false, error: error.message };
  }
};

// Unlink Telegram account
const unlinkTelegramAccount = async (userId) => {
  try {
    await TelegramUser.findOneAndDelete({ user: userId });
    await User.findByIdAndUpdate(userId, {
      'telegram.telegramId': null,
      'telegram.isLinked': false
    });
    
    return { success: true, message: 'Telegram account unlinked' };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export {
  verifyTelegramLogin,
  telegramLogin,
  linkTelegramAccount,
  unlinkTelegramAccount,
  generateLoginHash
};
