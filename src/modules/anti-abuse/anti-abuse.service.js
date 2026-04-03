import AbuseReport from './abuse-report.model.js';

// Rate limiting per user
const userActions = new Map();

export const checkRateLimit = (userId, action, maxAttempts = 10, windowMs = 60000) => {
  const key = `${userId}:${action}`;
  const now = Date.now();

  if (!userActions.has(key)) {
    userActions.set(key, []);
  }

  const actions = userActions.get(key);
  const recentActions = actions.filter(time => now - time < windowMs);

  if (recentActions.length >= maxAttempts) {
    throw new Error('Rate limit exceeded. Please try again later.');
  }

  recentActions.push(now);
  userActions.set(key, recentActions);
};

// Suspicious pattern detection
export const detectSuspiciousActivity = async (userId, action) => {
  const suspiciousPatterns = [];

  // Check for rapid box openings
  if (action === 'openBox') {
    const key = `openBox:${userId}`;
    const count = userActions.get(key)?.length || 0;
    if (count > 50) {
      suspiciousPatterns.push('Rapid box openings detected');
    }
  }

  // Check for multiple accounts from same IP
  // (would require IP tracking in user model)

  return suspiciousPatterns;
};

export const reportAbuse = async (reporterId, data) => {
  const report = await AbuseReport.create({
    reporter: reporterId,
    reported: data.reportedUserId,
    type: data.type,
    description: data.description,
    evidence: data.evidence
  });
  return report;
};
