// Enterprise Configuration
// =====================

module.exports = {
  server: {
    port: process.env.PORT || 3000,
    env: process.env.NODE_ENV || 'development',
    trustedProxies: ['127.0.0.1', '::1'],
    trustProxy: true,
    requestSizeLimit: '10mb',
    timeout: 30000
  },

  database: {
    mongo: {
      uri: process.env.MONGO_URI || 'mongodb://localhost:27017/athena',
      options: {
        maxPoolSize: 10,
        minPoolSize: 2,
        connectTimeoutMS: 30000,
        socketTimeoutMS: 45000,
        w: 'majority',
        retryWrites: true,
        retryReads: true
      }
    },
    redis: {
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || 6379,
      password: process.env.REDIS_PASSWORD,
      db: 0,
      enableOfflineQueue: false,
      maxRetriesPerRequest: 3
    }
  },

  security: {
    jwt: {
      accessTokenExpiry: '15m',
      refreshTokenExpiry: '7d',
      issuer: 'athena-platform'
    },
    cors: {
      origin: process.env.CORS_ORIGIN || ['http://localhost:5173', 'http://localhost:3000'],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
    },
    rateLimit: {
      windowMs: 15 * 60 * 1000,
      max: 100,
      standardHeaders: true,
      legacyHeaders: false
    },
    helmet: {
      contentSecurityPolicy: true,
      hsts: true,
      xssFilter: true,
      noSniff: true,
      frameguard: 'DENY'
    }
  },

  payment: {
    providers: {
      stripe: { enabled: true, webhookSecret: process.env.STRIPE_WEBHOOK_SECRET },
      paypal: { enabled: true, webhookId: process.env.PAYPAL_WEBHOOK_ID },
      crypto: { enabled: true, networks: ['BTC', 'ETH', 'USDT'] }
    },
    minDeposit: 10,
    maxDeposit: 10000,
    minWithdraw: 20,
    maxWithdraw: 5000,
    fee: { deposit: 0, withdraw: 1 }
  },

  game: {
    box: { minCost: 10, maxCost: 1000, maxPerDay: 100, cooldown: 5000 },
    rng: { algorithm: 'hmac-sha256', serverSeedRotation: 'hourly' },
    houseEdge: { default: 5, vip: 3 }
  },

  queue: {
    concurrency: 5,
    maxRetries: 3,
    retryDelay: 1000
  },

  logging: {
    level: process.env.LOG_LEVEL || 'info',
    format: 'json',
    transports: { console: true, file: true, errorFile: true }
  },

  cache: {
    ttl: 300,
    checkPeriod: 60
  },

  features: {
    twoFactor: true,
    referral: true,
    leaderboard: true,
    chat: false,
    vpnCheck: true
  }
}
