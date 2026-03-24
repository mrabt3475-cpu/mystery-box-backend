import { Injectable, Logger } from '@nestjs/common';

export interface AbuseCheckResult {
  allowed: boolean;
  reason?: string;
  riskLevel: 'low' | 'medium' | 'high';
}

@Injectable()
export class AntiAbuseService {
  private readonly logger = new Logger(AntiAbuseService.name);
  
  // In-memory cache (use Redis in production)
  private userActivityCache = new Map<string, { timestamps: number[]; dailyCount: number }>();
  
  // Configuration
  private readonly config = {
    rateLimits: {
      open_box: 20,      // per minute
      create_order: 10,  // per minute
      deposit: 5,        // per minute
    },
    dailyLimits: {
      open_box: 50,      // per day
      free_box: 1,       // per day
      deposit: 10,       // per day
      create_order: 30,  // per day
    },
  };

  async check(userId: string, action: string, metadata?: any): Promise<AbuseCheckResult> {
    // Check rate limit (per minute)
    const rateCheck = this.checkRateLimit(userId, action);
    if (!rateCheck.allowed) return rateCheck;

    // Check daily limit
    const dailyCheck = this.checkDailyLimit(userId, action);
    if (!dailyCheck.allowed) return dailyCheck;

    // Check for suspicious patterns
    const patternCheck = this.checkSuspiciousPattern(userId, action);
    if (!patternCheck.allowed) return patternCheck;

    return { allowed: true, riskLevel: 'low' };
  }

  private checkRateLimit(userId: string, action: string): AbuseCheckResult {
    const key = 'rate:' + userId + ':' + action;
    const now = Date.now();
    const windowMs = 60000; // 1 minute
    
    let data = this.userActivityCache.get(key);
    if (!data) {
      data = { timestamps: [], dailyCount: 0 };
      this.userActivityCache.set(key, data);
    }

    // Filter recent requests (last minute)
    const recentRequests = data.timestamps.filter(t => now - t < windowMs);
    const limit = this.config.rateLimits[action as keyof typeof this.config.rateLimits] || 20;
    
    if (recentRequests.length >= limit) {
      this.logger.warn('Rate limit exceeded: ' + userId + ' - ' + action);
      return { allowed: false, reason: 'Too many requests (rate limit)', riskLevel: 'medium' };
    }
    
    recentRequests.push(now);
    data.timestamps = recentRequests;
    
    return { allowed: true, riskLevel: 'low' };
  }

  private checkDailyLimit(userId: string, action: string): AbuseCheckResult {
    const today = new Date().toISOString().split('T')[0];
    const key = 'daily:' + userId + ':' + action + ':' + today;
    const now = Date.now();
    
    let data = this.userActivityCache.get(key);
    if (!data) {
      data = { timestamps: [], dailyCount: 0 };
      this.userActivityCache.set(key, data);
    }

    const limit = this.config.dailyLimits[action as keyof typeof this.config.dailyLimits] || 100;
    
    if (data.dailyCount >= limit) {
      this.logger.warn('Daily limit exceeded: ' + userId + ' - ' + action);
      return { allowed: false, reason: 'Daily limit exceeded', riskLevel: 'medium' };
    }
    
    data.dailyCount++;
    
    return { allowed: true, riskLevel: 'low' };
  }

  private checkSuspiciousPattern(userId: string, action: string): AbuseCheckResult {
    // Check for rapid sequential actions (potential bot)
    const key = 'pattern:' + userId + ':' + action;
    const now = Date.now();
    
    let data = this.userActivityCache.get(key);
    if (!data) {
      data = { timestamps: [], dailyCount: 0 };
      this.userActivityCache.set(key, data);
    }

    // Check if actions are too close together (< 500ms)
    const recent = data.timestamps.filter(t => now - t < 500);
    if (recent.length >= 5) {
      this.logger.warn('Suspicious pattern detected: ' + userId + ' - ' + action);
      return { allowed: false, reason: 'Suspicious activity detected', riskLevel: 'high' };
    }
    
    data.timestamps.push(now);
    
    // Keep only last 10 timestamps
    if (data.timestamps.length > 10) {
      data.timestamps = data.timestamps.slice(-10);
    }
    
    return { allowed: true, riskLevel: 'low' };
  }

  // Get user stats
  getUserStats(userId: string): any {
    const stats: any = {};
    const actions = ['open_box', 'create_order', 'deposit', 'free_box'];
    const today = new Date().toISOString().split('T')[0];
    
    for (const action of actions) {
      const key = 'daily:' + userId + ':' + action + ':' + today;
      const data = this.userActivityCache.get(key);
      stats[action] = data?.dailyCount || 0;
    }
    
    return stats;
  }
}