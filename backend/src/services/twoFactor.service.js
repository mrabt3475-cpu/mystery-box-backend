// Two-Factor Authentication Service
// ====================================

const speakeasy = require('speakeasy')
const QRCode = require('qrcode')
const crypto = require('crypto')

class TwoFactorService {
  // Generate secret for user
  async generateSecret(userId) {
    const secret = speakeasy.generateSecret({
      name: `Athena:${userId}`,
      issuer: 'Athena Platform',
      length: 32
    })
    
    // Store secret temporarily (not verified yet)
    // In production, store in database with isVerified: false
    return {
      secret: secret.base32,
      otpauthUrl: secret.otpauth_url
    }
  }
  
  // Generate QR Code
  async generateQRCode(otpauthUrl) {
    try {
      const qrCode = await QRCode.toDataURL(otpauthUrl)
      return qrCode
    } catch (error) {
      throw new Error('Failed to generate QR code')
    }
  }
  
  // Verify token
  verifyToken(secret, token) {
    return speakeasy.totp.verify({
      secret: secret,
      encoding: 'base32',
      token: token,
      window: 1 // Allow 1 step tolerance
    })
  }
  
  // Generate backup codes
  generateBackupCodes(count = 10) {
    const codes = []
    for (let i = 0; i < count; i++) {
      codes.push(crypto.randomBytes(4).toString('hex').toUpperCase())
    }
    return codes
  }
  
  // Verify backup code
  verifyBackupCode(storedCodes, inputCode) {
    const index = storedCodes.findIndex(
      code => code.toUpperCase() === inputCode.toUpperCase() && !code.used
    )
    
    if (index === -1) return false
    
    // Mark code as used
    storedCodes[index].used = true
    return true
  }
}

module.exports = new TwoFactorService()
