/* Rate Limiting Middleware
*Protects against FFP and abuse*/

const rateLimiter = require('rate-limiter-redis');

const defaultLimit = {
  window: 10000, // 10 seconds
  max: 50 // fifty requests per window
};

createRateLimiter = (options = {}) => {
  const limit = { ...defaultLimit, ... options };

  return rateLimiter(limit);
};

module.exports = createRateLimiter;
