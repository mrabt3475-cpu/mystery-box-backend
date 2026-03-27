// Encrypted Storage Service
// =========================

const crypto = require('crypto')

const ALGORITHM = 'aes-256-gcm'
const IV_LENGTH = 16
const AUTH_TAG_LENGTH = 16
const SALT_LENGTH = 32
const KEY_LENGTH = 32
const ITERATIONS = 100000

class EncryptionService {
  constructor() {
    this.masterKey = process.env.ENCRYPTION_KEY || crypto.randomBytes(32).toString('hex')
  }
  
  // Derive key from password
  deriveKey(password, salt) {
    return crypto.pbkdf2Sync(
      password,
      salt,
      ITERATIONS,
      KEY_LENGTH,
      'sha512'
    )
  }
  
  // Encrypt data
  encrypt(plaintext, password = this.masterKey) {
    try {
      const salt = crypto.randomBytes(SALT_LENGTH)
      const key = this.deriveKey(password, salt)
      const iv = crypto.randomBytes(IV_LENGTH)
      
      const cipher = crypto.createCipheriv(ALGORITHM, key, iv, {
        authTagLength: AUTH_TAG_LENGTH
      })
      
      let encrypted = cipher.update(plaintext, 'utf8', 'hex')
      encrypted += cipher.final('hex')
      
      const authTag = cipher.getAuthTag()
      
      // Return salt + iv + authTag + encrypted
      return {
        encrypted,
        salt: salt.toString('hex'),
        iv: iv.toString('hex'),
        authTag: authTag.toString('hex')
      }
    } catch (error) {
      throw new Error('Encryption failed')
    }
  }
  
  // Decrypt data
  decrypt(encryptedData, password = this.masterKey) {
    try {
      const {
        encrypted,
        salt: saltHex,
        iv: ivHex,
        authTag: authTagHex
      } = encryptedData
      
      const salt = Buffer.from(saltHex, 'hex')
      const iv = Buffer.from(ivHex, 'hex')
      const authTag = Buffer.from(authTagHex, 'hex')
      const key = this.deriveKey(password, salt)
      
      const decipher = crypto.createDecipheriv(ALGORITHM, key, iv, {
        authTagLength: AUTH_TAG_LENGTH
      })
      
      decipher.setAuthTag(authTag)
      
      let decrypted = decipher.update(encrypted, 'hex', 'utf8')
      decrypted += decipher.final('utf8')
      
      return decrypted
    } catch (error) {
      throw new Error('Decryption failed')
    }
  }
  
  // Hash sensitive data (one-way)
  hash(data) {
    return crypto.createHash('sha256').update(data).digest('hex')
  }
  
  // Generate secure random token
  generateToken(length = 32) {
    return crypto.randomBytes(length).toString('hex')
  }
  
  // Mask sensitive data
  maskEmail(email) {
    const [username, domain] = email.split('@')
    if (!domain) return email
    
    const maskedUsername = username.charAt(0) + 
      '*'.repeat(Math.min(username.length - 2, 8)) + 
      username.charAt(username.length - 1)
    
    return `${maskedUsername}@${domain}`
  }
  
  maskPhone(phone) {
    if (!phone || phone.length < 4) return phone
    return '*'.repeat(phone.length - 4) + phone.slice(-4)
  }
  
  // Encrypt object fields
  encryptFields(obj, fields, password) {
    const encrypted = { ...obj }
    
    for (const field of fields) {
      if (encrypted[field]) {
        encrypted[field] = this.encrypt(
          JSON.stringify(encrypted[field]),
          password
        )
      }
    }
    
    return encrypted
  }
  
  // Decrypt object fields
  decryptFields(obj, fields, password) {
    const decrypted = { ...obj }
    
    for (const field of fields) {
      if (decrypted[field] && typeof decrypted[field] === 'object') {
        try {
          decrypted[field] = JSON.parse(
            this.decrypt(decrypted[field], password)
          )
        } catch (e) {
          // Field might not be encrypted
        }
      }
    }
    
    return decrypted
  }
}

module.exports = new EncryptionService()
