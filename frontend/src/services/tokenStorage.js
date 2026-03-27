// Secure Token Storage Service
// ============================

const TOKEN_KEY = 'athena_auth'
const REFRESH_TOKEN_KEY = 'athena_refresh'

class SecureTokenStorage {
  constructor() {
    this.token = null
    this.refreshToken = null
    this.listeners = new Set()
  }

  // Store tokens securely
  setTokens(accessToken, refreshToken = null) {
    this.token = accessToken
    this.refreshToken = refreshToken
    
    try {
      // Use sessionStorage for access token (cleared on tab close)
      sessionStorage.setItem(TOKEN_KEY, accessToken)
      
      // Use localStorage for refresh token (persists)
      if (refreshToken) {
        localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
      }
      
      this.notifyListeners()
    } catch (e) {
      console.error('Failed to store tokens:', e)
    }
  }

  // Get access token
  getToken() {
    if (this.token) return this.token
    
    try {
      this.token = sessionStorage.getItem(TOKEN_KEY)
      return this.token
    } catch (e) {
      return null
    }
  }

  // Get refresh token
  getRefreshToken() {
    if (this.refreshToken) return this.refreshToken
    
    try {
      this.refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY)
      return this.refreshToken
    } catch (e) {
      return null
    }
  }

  // Clear tokens
  clearTokens() {
    this.token = null
    this.refreshToken = null
    
    try {
      sessionStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(REFRESH_TOKEN_KEY)
      this.notifyListeners()
    } catch (e) {
      console.error('Failed to clear tokens:', e)
    }
  }

  // Check if authenticated
  isAuthenticated() {
    return !!this.getToken()
  }

  // Subscribe to changes
  subscribe(callback) {
    this.listeners.add(callback)
    return () => this.listeners.delete(callback)
  }

  // Notify listeners
  notifyListeners() {
    this.listeners.forEach(callback => callback(this.isAuthenticated()))
  }
}

export const tokenStorage = new SecureTokenStorage()

export default tokenStorage
