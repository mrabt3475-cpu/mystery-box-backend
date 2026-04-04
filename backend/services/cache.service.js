// Cache Service - Performance Optimization
// Uses in-memory cache (can be replaced with Redis)

class CacheService {
  constructor() {
    this.cache = new Map();
    this.defaultTTL = 5 * 60 * 1000; // 5 minutes
  }

  // Generate cache key
  generateKey(prefix, data) {
    return `${prefix}:${JSON.stringify(data)}`;
  }

  // Get from cache
  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }

    return item.value;
  }

  // Set in cache
  set(key, value, ttl = this.defaultTTL) {
    this.cache.set(key, {
      value,
      expiry: Date.now() + ttl
    });
  }

  // Delete from cache
  delete(key) {
    this.cache.delete(key);
  }

  // Clear all cache
  clear() {
    this.cache.clear();
  }

  // Delete by prefix
  deleteByPrefix(prefix) {
    for (const key of this.cache.keys()) {
      if (key.startsWith(prefix)) {
        this.cache.delete(key);
      }
    }
  }

  // Get cache stats
  getStats() {
    let active = 0;
    let expired = 0;
    const now = Date.now();

    for (const item of this.cache.values()) {
      if (now > item.expiry) {
        expired++;
      } else {
        active++;
      }
    }

    return {
      total: this.cache.size,
      active,
      expired
    };
  }

  // Cleanup expired entries
  cleanup() {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiry) {
        this.cache.delete(key);
      }
    }
  }
}

// Cache middleware factory
const cacheMiddleware = (prefix, ttl = 300) => {
  return (req, res, next) => {
    const cacheKey = cacheService.generateKey(prefix, {
      query: req.query,
      params: req.params
    });

    const cached = cacheService.get(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    // Store original json method
    const originalJson = res.json.bind(res);

    res.json = (data) => {
      // Only cache successful responses
      if (data?.success !== false) {
        cacheService.set(cacheKey, data, ttl * 1000);
      }
      return originalJson(data);
    };

    next();
  };
};

// Invalidate cache on mutations
const invalidateCache = (prefix) => {
  cacheService.deleteByPrefix(prefix);
};

const cacheService = new CacheService();

// Cleanup every 5 minutes
setInterval(() => cacheService.cleanup(), 5 * 60 * 1000);

module.exports = {
  cacheService,
  cacheMiddleware,
  invalidateCache
};