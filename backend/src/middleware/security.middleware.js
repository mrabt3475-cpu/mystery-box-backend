// Security Middleware
// ===================

const { verifyCSRFToken, sanitizeInput, getRateLimitKey, AuditEvents, securityHeaders } = require('../utils/security')
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const crypto = require('crypto')

// Security Audit Logger
const auditLogger = (req, res, next) => {
  const start = Date.now()
  
  // Log after response
  res.on('finish', () => {
    const duration = Date.now() - start
    const logData = {
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.originalUrl,
      ip: req.ip,
      userId: req.user?._id || 'anonymous',
      statusCode: res.statusCode,
      duration,
      userAgent: req.get('user-agent')
    }
    
    // Log security events
    if (res.statusCode >= 400) {
      console.log('[SECURITY AUDIT]', JSON.stringify(logData))
    }
  })
  
  next()
}

// CSRF Protection Middleware
const csrfProtection = (req, res, next) => {
  // Skip for GET requests and API routes
  if (req.method === 'GET' || req.path.startsWith('/api/')) {
    return next()
  }
  
  const token = req.body._csrf || req.headers['x-csrf-token']
  const sessionToken = req.session?.csrfToken
  
  if (!verifyCSRFToken(token, sessionToken)) {
    return res.status(403).json({
      success: false,
      error: 'Invalid CSRF token'
    })
  }
  
  next()
}

// Input Sanitization Middleware
const inputSanitization = (req, res, next) => {
  const sanitizeObject = (obj) => {
    for (const key in obj) {
      if (typeof obj[key] === 'string') {
        obj[key] = sanitizeInput(obj[key])
      } else if (typeof obj[key] === 'object') {
        sanitizeObject(obj[key])
      }
    }
  }
  
  if (req.body) sanitizeObject(req.body)
  if (req.query) sanitizeObject(req.query)
  if (req.params) sanitizeObject(req.params)
  
  next()
}

// Request Size Limiter
const requestSizeLimiter = (req, res, next) => {
  const contentLength = parseInt(req.headers['content-length'] || 0)
  const maxSize = 1024 * 1024 // 1MB
  
  if (contentLength > maxSize) {
    return res.status(413).json({
      success: false,
      error: 'Payload too large'
    })
  }
  
  next()
}

// IP Blacklist Check
const ipBlacklist = new Set([]) // Add blocked IPs here

const ipFilter = (req, res, next) => {
  const clientIP = req.ip || req.connection.remoteAddress
  
  if (ipBlacklist.has(clientIP)) {
    return res.status(403).json({
      success: false,
      error: 'Access denied'
    })
  }
  
  next()
}

// User Agent Filter
const userAgentFilter = (req, res, next) => {
  const userAgent = req.get('user-agent') || ''
  
  // Block known malicious user agents
  const blockedAgents = ['sqlmap', 'nikto', 'nmap', 'masscan', 'zap', 'burp']
  const isBlocked = blockedAgents.some(agent => 
    userAgent.toLowerCase().includes(agent)
  )
  
  if (isBlocked) {
    return res.status(403).json({
      success: false,
      error: 'Access denied'
    })
  }
  
  next()
}

// Advanced Rate Limiter
const createRateLimiter = (options = {}) => {
  return rateLimit({
    windowMs: options.windowMs || 15 * 60 * 1000, // 15 minutes
    max: options.max || 100, // limit each IP to 100 requests per windowMs
    keyGenerator: getRateLimitKey,
    message: {
      success: false,
      error: 'Too many requests, please try again later'
    },
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => {
      // Skip for health checks
      return req.path === '/health'
    }
  })
}

// Strict Rate Limiter for sensitive endpoints
const strictRateLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: 10 // 10 requests per minute
})

// Auth Rate Limiter
const authRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5 // 5 attempts per 15 minutes
})

// Security Headers Middleware
const securityHeadersMiddleware = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      fontSrc: ["'self'", "data:"],
      connectSrc: ["'self'"],
      frameAncestors: ["'none'"]
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  xssFilter: true,
  noSniff: true,
  referrerPolicy: 'strict-origin-when-cross-origin'
})

// Account Lockout Middleware
const accountLockout = new Map() // userId -> { attempts, lockedUntil }

const checkAccountLockout = (req, res, next) => {
  const userId = req.body.email || req.body.username
  if (!userId) return next()
  
  const lockData = accountLockout.get(userId)
  
  if (lockData) {
    if (lockData.lockedUntil > Date.now()) {
      const remainingTime = Math.ceil((lockData.lockedUntil - Date.now()) / 1000)
      return res.status(423).json({
        success: false,
        error: `Account locked. Try again in ${remainingTime} seconds`,
        locked: true,
        retryAfter: remainingTime
      })
    }
    
    // Reset if lockout expired
    if (lockData.lockedUntil <= Date.now()) {
      accountLockout.delete(userId)
    }
  }
  
  next()
}

const recordFailedAttempt = (userId) => {
  const current = accountLockout.get(userId) || { attempts: 0, lockedUntil: 0 }
  current.attempts += 1
  
  // Lock after 5 failed attempts for 15 minutes
  if (current.attempts >= 5) {
    current.lockedUntil = Date.now() + 15 * 60 * 1000
    current.attempts = 0
  }
  
  accountLockout.set(userId, current)
}

const clearFailedAttempts = (userId) => {
  accountLockout.delete(userId)
}

// Two-Factor Authentication Middleware
const require2FA = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required'
    })
  }
  
  if (req.user.twoFactorEnabled && !req.user.twoFactorVerified) {
    return res.status(403).json({
      success: false,
      error: '2FA verification required',
      requires2FA: true
    })
  }
  
  next()
}

// Session Security
const sessionSecurity = (req, res, next) => {
  if (req.session) {
    // Regenerate session periodically
    const sessionAge = Date.now() - (req.session.createdAt || 0)
    const maxSessionAge = 24 * 60 * 60 * 1000 // 24 hours
    
    if (sessionAge > maxSessionAge) {
      req.session.regenerate((err) => {
        if (err) {
          return res.status(500).json({
            success: false,
            error: 'Session error'
          })
        }
        next()
      })
    } else {
      next()
    }
  } else {
    next()
  }
}

module.exports = {
  auditLogger,
  csrfProtection,
  inputSanitization,
  requestSizeLimiter,
  ipFilter,
  userAgentFilter,
  createRateLimiter,
  strictRateLimiter,
  authRateLimiter,
  securityHeadersMiddleware,
  checkAccountLockout,
  recordFailedAttempt,
  clearFailedAttempts,
  require2FA,
  sessionSecurity
}
