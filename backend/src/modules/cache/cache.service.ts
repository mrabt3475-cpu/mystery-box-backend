import { Injectable, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
  private readonly logger = new Logger(CacheService.name);

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async get<T>(key: string): Promise<T | undefined> {
    try {
      return await this.cacheManager.get<T>(key);
    } catch (error) {
      this.logger.error(`Error getting cache key ${key}:`, error);
      return undefined;
    }
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    try {
      if (ttl) {
        await this.cacheManager.set(key, value, ttl * 1000);
      } else {
        await this.cacheManager.set(key, value);
      }
    } catch (error) {
      this.logger.error(`Error setting cache key ${key}:`, error);
    }
  }

  async del(key: string): Promise<void> {
    try {
      await this.cacheManager.del(key);
    } catch (error) {
      this.logger.error(`Error deleting cache key ${key}:`, error);
    }
  }

  async delPattern(pattern: string): Promise<void> {
    try {
      const keys = await this.cacheManager.store.keys(pattern);
      if (keys && keys.length > 0) {
        await this.cacheManager.store.del(...keys);
      }
    } catch (error) {
      this.logger.error(`Error deleting cache pattern ${pattern}:`, error);
    }
  }

  async reset(): Promise<void> {
    try {
      await this.cacheManager.reset();
    } catch (error) {
      this.logger.error('Error resetting cache:', error);
    }
  }

  async cacheWrap<T>(
    key: string,
    fn: () => Promise<T>,
    ttl: number = 300,
  ): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached !== undefined) {
      return cached;
    }

    const result = await fn();
    await this.set(key, result, ttl);
    return result;
  }

  async cacheUser(userId: string, data: any, ttl: number = 300): Promise<void> {
    await this.set(`user:${userId}`, data, ttl);
  }

  async getCachedUser(userId: string): Promise<any> {
    return this.get(`user:${userId}`);
  }

  async invalidateUser(userId: string): Promise<void> {
    await this.del(`user:${userId}`);
  }

  async cacheBox(boxId: string, data: any, ttl: number = 600): Promise<void> {
    await this.set(`box:${boxId}`, data, ttl);
  }

  async getCachedBox(boxId: string): Promise<any> {
    return this.get(`box:${boxId}`);
  }

  async cacheLeaderboard(data: any, ttl: number = 60): Promise<void> {
    await this.set('leaderboard', data, ttl);
  }

  async getCachedLeaderboard(): Promise<any> {
    return this.get('leaderboard');
  }

  async invalidateLeaderboard(): Promise<void> {
    await this.del('leaderboard');
  }
}
