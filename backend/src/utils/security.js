// Security Utilities
// ==================

const crypto = require('crypto')

// Generate CSRF Token
function generateCSRFToken() {
  return crypto.randomBytes(32).toString('hex')
}

// Verify CSRF Token
function verifyCSRFToken(token, sessionToken) {
  if (!token || !sessionToken) return false
  return crypto.timingSafeEqual(
    Buffer.from(token),
    Buffer.from(sessionToken)
  )
}

// Hash Password with bcrypt
async function hashPassword(password) {
  const bcrypt = require('bcryptjs')
  return bcrypt.hash(password, 12)
}

// Compare Password
async function comparePassword(password, hash) {
  const bcrypt = require('bcryptjs')
  return bcrypt.compare(password, hash)
}

// Generate JWT Secret
function generateJWTSecret() {
  return crypto.randomBytes(64).toString('hex')
}

// Sanitize Input
function sanitizeInput(input) {
  if (typeof input !== 'string') return input
  return input
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .trim()
}

// Validate Email
function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

// Validate Password Strength
function validatePasswordStrength(password) {
  const hasUpperCase = /[A-Z]/.test(password)
  const hasLowerCase = /[a-z]/.test(password)
  const hasNumbers = /\d/.test(password)
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)
  const isLongEnough = password.length >= 8
  
  return {
    isValid: hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar && isLongEnough,
    hasUpperCase,
    hasLowerCase,
    hasNumbers,
    hasSpecialChar,
    isLongEnough,
    strength: [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar, isLongEnough].filter(Boolean).length
  }
}

// Rate Limit Key Generator
function getRateLimitKey(req) {
  const ip = req.ip || req.connection.remoteAddress
  const userId = req.user?._id || 'anonymous'
  return `${ip}:${userId}`
}

// Generate API Key
function generateAPIKey() {
  const prefix = 'athena_'
  const randomPart = crypto.randomBytes(32).toString('hex')
  return `${prefix}${randomPart}`
}

// Hash API Key (for storage)
function hashAPIKey(apiKey) {
  return crypto.createHash('sha256').update(apiKey).digest('hex')
}

// Input Validation Rules
const validationRules = {
  username: {
    minLength: 3,
    maxLength: 30,
    pattern: /^[a-zA-Z0-9_]+$/
  },
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  password: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumber: true,
    requireSpecial: true
  },
  phone: {
    pattern: /^\+?[1-9]\d{1,14}$/
  }
}

// Validate Field
function validateField(fieldName, value) {
  const rules = validationRules[fieldName]
  if (!rules) return { isValid: true }

  const errors = []

  if (rules.minLength && value.length < rules.minLength) {
    errors.push(`${fieldName} must be at least ${rules.minLength} characters`)
  }

  if (rules.maxLength && value.length > rules.maxLength) {
    errors.push(`${fieldName} must not exceed ${rules.maxLength} characters`)
  }

  if (rules.pattern && !rules.pattern.test(value)) {
    errors.push(`${fieldName} format is invalid`)
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

// Audit Log Event Types
const AuditEvents = {
  USER_LOGIN: 'user.login',
  USER_LOGOUT: 'user.logout',
  USER_REGISTER: 'user.register',
  PASSWORD_CHANGE: 'password.change',
  EMAIL_CHANGE: 'email.change',
  API_KEY_CREATE: 'api_key.create',
  API_KEY_DELETE: 'api_key.delete',
  BOX_OPEN: 'box.open',
  PURCHASE: 'purchase',
  WITHDRAWAL: 'withdrawal',
  ADMIN_ACTION: 'admin.action',
  SECURITY_VIOLATION: 'security.violation'
}

// Security Headers
const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;"
}

module.exports = {
  generateCSRFToken,
  verifyCSRFToken,
  hashPassword,
  comparePassword,
  generateJWTSecret,
  sanitizeInput,
  validateEmail,
  validatePasswordStrength,
  getRateLimitKey,
  generateAPIKey,
  hashAPIKey,
  validateField,
  validationRules,
  AuditEvents,
  securityHeaders
}
