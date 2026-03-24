import { Injectable, Logger } from '@nestjs/common';

export interface AbuseCheckResult {
  allowed: boolean;
  reason?: string;
  riskLevel: 'low' | 'medium' | 'high';
}

@Injectable()
export class AntiAbuseService {
  private readonly logger = new Logger(AntiAbuseService.name);
  private userActivityCache = new Map();

  async check(userId: string, action: string, metadata?: any): Promise<AbuseCheckResult> {
    const rateCheck = this.checkRateLimit(userId, action);
    if (!rateCheck.allowed) return rateCheck;

    const dailyCheck = this.checkDailyLimit(userId, action);
    if (!dailyCheck.allowed) return dailyCheck;

    return { allowed: true, riskLevel: 'low' };
  }

  private checkDailyLimit(userId: string, action: string): AbuseCheckResult {
    const today = new Date().toISOString().split('T')[0];
    const cacheKey = 'daily:' + userId + ':' + action + ':' + today;
    const count = this.userActivityCache.get(cacheKey) || 0;
    const limits = { 'open_box': 50, 'free_box': 1, 'deposit': 10 };
    const limit = limits[action] || 100;
    
    if (count >= limit) {
      return { allowed: false, reason: 'Daily limit exceeded', riskLevel: 'medium' };
    }
    this.userActivityCache.set(cacheKey, count + 1);
    return { allowed: true, riskLevel: 'low' };
  }

  private checkRateLimit(userId: string, action: string): AbuseCheckResult {
    const key = 'rate:' + userId + ':' + action;
    const now = Date.now();
    const requests = this.userActivityCache.get(key) || [];
    const recentRequests = requests.filter((t) => now - t < 60000);
    const limit = 20;
    if (recentRequests.length >= limit) {
      return { allowed: false, reason: 'Too many requests', riskLevel: 'medium' };
    }
    recentRequests.push(now);
    this.userActivityCache.set(key, recentRequests);
    return { allowed: true, riskLevel: 'low' };
  }
}