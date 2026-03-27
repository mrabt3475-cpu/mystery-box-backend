import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RateLimit } from './rate-limit.decorator';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class RateLimitGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private redisService: RedisService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const rateLimit = this.reflector.get<RateLimit>('rateLimit', context.getHandler());
    
    if (!rateLimit) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const userId = request.user?.userId || request.ip;
    const key = `rate_limit:${context.getClass().name}:${context.getHandler().name}:${userId}`;

    const current = await this.redisService.incr(key);
    
    if (current === 1) {
      await this.redisService.expire(key, rateLimit.windowMs / 1000);
    }

    if (current > rateLimit.limit) {
      throw new HttpException(
        `Rate limit exceeded. Try again in ${rateLimit.windowMs / 1000} seconds`,
        HttpStatus.TOO_MANY_REQUESTS
      );
    }

    // Set rate limit headers
    const response = context.switchToHttp().getResponse();
    response.setHeader('X-RateLimit-Limit', rateLimit.limit);
    response.setHeader('X-RateLimit-Remaining', Math.max(0, rateLimit.limit - current));
    response.setHeader('X-RateLimit-Reset', Math.ceil(Date.now() / 1000 + rateLimit.windowMs / 1000));

    return true;
  }
}
