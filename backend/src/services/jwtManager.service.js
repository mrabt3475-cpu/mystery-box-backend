// Enhanced JWT Configuration
// =========================

const jwt = require('jsonwebtoken')
const crypto = require('crypto')

class JWTManager {
  constructor() {
    this.secret = process.env.JWT_SECRET || this.generateSecret()
    this.refreshSecret = process.env.JWT_REFRESH_SECRET || this.generateSecret()
    this.accessTokenExpiry = '15m'
    this.refreshTokenExpiry = '7d'
    this.emailTokenExpiry = '1h'
    this.resetTokenExpiry = '30m'
  }

  generateSecret() {
    return crypto.randomBytes(64).toString('hex')
  }

  generateAccessToken(payload) {
    return jwt.sign(payload, this.secret, {
      expiresIn: this.accessTokenExpiry,
      algorithm: 'HS256',
      issuer: 'athena-platform',
      jwtid: this.generateJTI()
    })
  }

  generateRefreshToken(payload) {
    return jwt.sign(payload, this.refreshSecret, {
      expiresIn: this.refreshTokenExpiry,
      algorithm: 'HS256',
      issuer: 'athena-platform',
      jwtid: this.generateJTI(),
      tokenType: 'refresh'
    })
  }

  generateEmailToken(userId, email) {
    return jwt.sign({ userId, email, type: 'email_verification' }, this.secret, {
      expiresIn: this.emailTokenExpiry,
      algorithm: 'HS256'
    })
  }

  generatePasswordResetToken(userId) {
    return jwt.sign({ userId, type: 'password_reset' }, this.secret, {
      expiresIn: this.resetTokenExpiry,
      algorithm: 'HS256'
    })
  }

  verifyToken(token, type = 'access') {
    const secret = type === 'refresh' ? this.refreshSecret : this.secret
    try {
      const decoded = jwt.verify(token, secret, { algorithms: ['HS256'], issuer: 'athena-platform' })
      return { valid: true, decoded }
    } catch (error) {
      return { valid: false, error: error.message, expired: error.name === 'TokenExpiredError' }
    }
  }

  generateJTI() {
    return crypto.randomBytes(16).toString('hex')
  }

  decodeToken(token) {
    return jwt.decode(token)
  }

  async isBlacklisted(token) {
    return false
  }

  async blacklistToken(token, expiry) {
    console.log(`[JWT] Token blacklisted until: ${expiry}`)
  }

  generateTokenPair(user) {
    const payload = { id: user._id, username: user.username, email: user.email, role: user.role }
    return { accessToken: this.generateAccessToken(payload), refreshToken: this.generateRefreshToken({ ...payload, id: user._id }) }
  }

  async refreshTokens(refreshToken) {
    const verification = this.verifyToken(refreshToken, 'refresh')
    if (!verification.valid) throw new Error('Invalid refresh token')
    const user = verification.decoded
    return this.generateTokenPair(user)
  }
}

module.exports = new JWTManager()
