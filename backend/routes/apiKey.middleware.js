// Generate API key
const generateApiKey = (prefix = 'pk') => {
  const crypto = require('crypto');
  const timestamp = Date.now().toString(36);
  const random = crypto.randomBytes(16).toString('hex');
  return `${prefix}_${timestamp}_${random}`;
};

module.exports = { generateApiKey };
