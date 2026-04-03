// Constants Configuration
module.exports = {
  // User Roles
  USER_ROLES: {
    USER: 'user',
    MODERATOR: 'moderator',
    ADMIN: 'admin',
    OWNER: 'owner',
  },

  // User Status
  USER_STATUS: {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    BANNED: 'banned',
    PENDING: 'pending',
  },

  // Subscription Tiers
  SUBSCRIPTION_TIERS: {
    FREE: 'free',
    BASIC: 'basic',
    PREMIUM: 'premium',
    VIP: 'vip',
  },

  // Channel Status
  CHANNEL_STATUS: {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    BANNED: 'banned',
  },

  // Product Status
  PRODUCT_STATUS: {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    OUT_OF_STOCK: 'out_of_stock',
  },

  // Order Status
  ORDER_STATUS: {
    PENDING: 'pending',
    PROCESSING: 'processing',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
    REFUNDED: 'refunded',
  },

  // Payment Status
  PAYMENT_STATUS: {
    PENDING: 'pending',
    PROCESSING: 'processing',
    COMPLETED: 'completed',
    FAILED: 'failed',
    REFUNDED: 'refunded',
  },

  // Payment Methods
  PAYMENT_METHODS: {
    CARD: 'card',
    CRYPTO: 'crypto',
    WALLET: 'wallet',
  },

  // Box Rarity
  BOX_RARITY: {
    COMMON: 'common',
    RARE: 'rare',
    EPIC: 'epic',
    LEGENDARY: 'legendary',
  },

  // Box Types
  BOX_TYPES: {
    STANDARD: 'standard',
    PREMIUM: 'premium',
    VIP: 'vip',
    LIMITED: 'limited',
  },

  // Stream Status
  STREAM_STATUS: {
    OFFLINE: 'offline',
    LIVE: 'live',
    ENDED: 'ended',
  },

  // Prize Types
  PRIZE_TYPES: {
    POINTS: 'points',
    COUPON: 'coupon',
    PRODUCT: 'product',
    DISCOUNT: 'discount',
    BADGE: 'badge',
  },

  // Cache TTL (in seconds)
  CACHE_TTL: {
    SHORT: 300, // 5 minutes
    MEDIUM: 3600, // 1 hour
    LONG: 86400, // 24 hours
  },

  // Pagination
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 100,
  },

  // File Upload
  FILE_UPLOAD: {
    MAX_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  },
};
