// Auth Middleware - SECURE VERSION with Redis Account Lockout
import jwt from 'jsonwebtoken';
import User from '../modules/user/user.model.js';

// Configuration
const JWT_SECRET = process.env.JWT_SECRET;
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_TIME = 15 * 60 * 1000; // 15 minutes

// In-memory fallback (for development without Redis)
const accountLockout = new Map();

// Check if account is locked
const isAccountLocked = async (email) => {
  // Try Redis first
  try {
    if (process.env.REDIS_URL) {
      const redis = await import('redis');
      const client = redis.createClient({ url: process.env.REDIS_URL });
      await client.connect();
      const locked = await client.get(`lockout:${email}`);
      await client.disconnect();
      return locked !== null;
    }
  } catch (e) {
    // Fall back to in-memory
  }
  
  // In-memory fallback
  const lockData = accountLockout.get(email);
  if (!lockData) return false;
  
  if (Date.now() > lockData.expiresAt) {
    accountLockout.delete(email);
    return false;
  }
  
  return true;
};

// Record failed attempt
const recordFailedAttempt = async (email) => {
  const key = `login_attempts:${email}`;
  
  try {
    if (process.env.REDIS_URL) {
      const redis = await import('redis');
      const client = redis.createClient({ url: process.env.REDIS_URL });
      await client.connect();
      
      const attempts = await client.incr(key);
      if (attempts === 1) {
        await client.expire(key, LOCKOUT_TIME / 1000);
      }
      
      if (attempts >= MAX_LOGIN_ATTEMPTS) {
        await client.setEx(`lockout:${email}`, LOCKOUT_TIME / 1000, JSON.stringify({ attempts }));
      }
      
      await client.disconnect();
      return;
    }
  } catch (e) {
    // Fall back to in-memory
  }
  
  // In-memory fallback
  const attempts = (accountLockout.get(email)?.attempts || 0) + 1;
  accountLockout.set(email, {
    attempts,
    expiresAt: Date.now() + LOCKOUT_TIME,
  });
};

// Clear failed attempts
const clearFailedAttempts = async (email) => {
  const key = `login_attempts:${email}`;
  
  try {
    if (process.env.REDIS_URL) {
      const redis = await import('redis');
      const client = redis.createClient({ url: process.env.REDIS_URL });
      await client.connect();
      await client.del(key);
      await client.disconnect();
      return;
    }
  } catch (e) {
    // Fall back to in-memory
  }
  
  accountLockout.delete(email);
};

// Authentication middleware
export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, error: 'No token provided' });
    }
    
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ success: false, error: 'User not found' });
    }
    
    if (user.status === 'banned') {
      return res.status(403).json({ success: false, error: 'Account is banned' });
    }
    
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, error: 'Token expired' });
    }
    return res.status(401).json({ success: false, error: 'Invalid token' });
  }
};

// Authorization middleware
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Not authenticated' });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, error: 'Not authorized' });
    }
    
    next();
  };
};

export { isAccountLocked, recordFailedAttempt, clearFailedAttempts };
