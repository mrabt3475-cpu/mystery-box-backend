// Constants

module.exports = {
  // User Roles
  ROLES: {
    USER: 'user',
    MODERATOR: 'moderator',
    ADMIN: 'admin'
  },

  // Points
  POINTS: {
    REFERRAL_BONUS: 10,
    DAILY_BONUS: 5,
    BIRTHDAY_BONUS: 50,
    STREAK_BONUS: 2,
    MINIMUM_GIFT: 1,
    POINTS_PERCENTAGE: 0.05 // 5% of purchase price
  },

  // Service Costs
  SERVICE_COSTS: {
    GROUP: 100,
    CHANNEL: 150,
    BOT: 200
  },

  // Box Categories
  BOX_CATEGORIES: {
    STANDARD: 'standard',
    PREMIUM: 'premium',
    VIP: 'vip',
    SPECIAL: 'special'
  },

  // Rarity
  RARITY: {
    COMMON: 'common',
    UNCOMMON: 'uncommon',
    RARE: 'rare',
    EPIC: 'epic',
    LEGENDARY: 'legendary'
  },

  // Order Status
  ORDER_STATUS: {
    PENDING: 'pending',
    PROCESSING: 'processing',
    SHIPPED: 'shipped',
    DELIVERED: 'delivered',
    CANCELLED: 'cancelled',
    REFUNDED: 'refunded'
  },

  // Payment Methods
  PAYMENT_METHODS: {
    POINTS: 'points',
    STRIPE: 'stripe',
    TON: 'ton',
    WALLET: 'wallet'
  },

  // Service Types
  SERVICE_TYPES: {
    GROUP: 'group',
    CHANNEL: 'channel',
    BOT: 'bot'
  },

  // Pagination
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 20,
    MAX_LIMIT: 100
  },

  // Rate Limits
  RATE_LIMITS: {
    API: 100,
    AUTH: 10,
    BOX_OPENING: 10,
    GIFT_SENDING: 5,
    POINTS_OPERATIONS: 20
  },

  // JWT
  JWT: {
    EXPIRE: '15m',
    REFRESH_EXPIRE: '7d'
  }
};
