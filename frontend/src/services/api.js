// Enhanced API Service with Caching & Interceptors
// ==================================================

import axios from 'axios'

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for httpOnly cookies
})

// Simple in-memory cache
const cache = new Map()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

// Cache helper
const getCached = (key) => {
  const cached = cache.get(key)
  if (!cached) return null
  
  if (Date.now() > cached.expiry) {
    cache.delete(key)
    return null
  }
  
  return cached.data
}

const setCache = (key, data, ttl = CACHE_TTL) => {
  cache.set(key, {
    data,
    expiry: Date.now() + ttl
  })
}

const invalidateCache = (pattern) => {
  for (const key of cache.keys()) {
    if (key.includes(pattern)) {
      cache.delete(key)
    }
  }
}

// Request interceptor - add auth token from cookie or header
api.interceptors.request.use(
  (config) => {
    // Try to get token from localStorage (for initial load)
    const storedAuth = localStorage.getItem('auth-storage')
    if (storedAuth) {
      try {
        const { state } = JSON.parse(storedAuth)
        if (state?.token) {
          config.headers.Authorization = `Bearer ${state.token}`
        }
      } catch (e) {
        // Ignore parse errors
      }
    }
    
    // Add request timestamp for caching
    config.metadata = { startTime: Date.now() }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor - handle errors globally
api.interceptors.response.use(
  (response) => {
    const duration = Date.now() - response.config.metadata.startTime
    console.log(`[API] ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status} (${duration}ms)`)
    
    return response
  },
  (error) => {
    const { response } = error
    
    // Handle different error types
    if (response) {
      switch (response.status) {
        case 401:
          // Unauthorized - clear auth and redirect to login
          localStorage.removeItem('auth-storage')
          delete api.defaults.headers.common['Authorization']
          window.location.href = '/login'
          break
          
        case 403:
          // Forbidden
          console.error('[API] Access forbidden')
          break
          
        case 429:
          // Too many requests
          console.warn('[API] Rate limited')
          break
          
        case 500:
          // Server error
          console.error('[API] Server error')
          break
      }
    } else if (error.code === 'ECONNABORTED') {
      // Timeout
      console.error('[API] Request timeout')
    } else if (!error.response) {
      // Network error
      console.error('[API] Network error')
    }
    
    return Promise.reject(error)
  }
)

// API Methods with caching support
const apiService = {
  // GET with optional caching
  get: async (url, options = {}) => {
    const { useCache = false, cacheKey, cacheTTL, ...axiosOptions } = options
    
    if (useCache && cacheKey) {
      const cached = getCached(cacheKey)
      if (cached) return cached
    }
    
    const res = await api.get(url, axiosOptions)
    
    if (useCache && cacheKey) {
      setCache(cacheKey, res.data, cacheTTL)
    }
    
    return res
  },

  // POST
  post: async (url, data, options = {}) => {
    const res = await api.post(url, data, options)
    invalidateCache(url.split('/')[1]) // Invalidate related cache
    return res
  },

  // PUT
  put: async (url, data, options = {}) => {
    const res = await api.put(url, data, options)
    invalidateCache(url.split('/')[1])
    return res
  },

  // PATCH
  patch: async (url, data, options = {}) => {
    const res = await api.patch(url, data, options)
    invalidateCache(url.split('/')[1])
    return res
  },

  // DELETE
  delete: async (url, options = {}) => {
    const res = await api.delete(url, options)
    invalidateCache(url.split('/')[1])
    return res
  },

  // Clear all cache
  clearCache: () => cache.clear(),

  // Get cache stats
  getCacheStats: () => ({
    size: cache.size,
    keys: Array.from(cache.keys())
  }),
}

export default apiService

export { invalidateCache, CACHE_TTL }
