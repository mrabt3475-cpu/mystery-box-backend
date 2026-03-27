import { Injectable, NestMiddleware, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ApiKeyService } from './api-key.service';
import { ApiUsageService } from './api-usage.service';
import { DeveloperService } from './developer.service';

declare global {
  namespace Express {
    interface Request {
      developer?: {
        id: string;
        keyId: string;
        permissions: string[];
      };
      apiKey?: any;
    }
  }
}

@Injectable()
export class ApiGatewayMiddleware implements NestMiddleware {
  constructor(
    private readonly apiKeyService: ApiKeyService,
    private readonly apiUsageService: ApiUsageService,
    private readonly developerService: DeveloperService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const startTime = Date.now();
    const apiKeyHeader = req.headers['x-api-key'] as string;

    // Skip if no API key (public endpoints)
    if (!apiKeyHeader) {
      return next();
    }

    try {
      // Parse key ID and secret from header
      // Format: "KeyID:KeySecret" or just use header as key
      const [keyId, keySecret] = apiKeyHeader.split(':');

      if (!keyId || !keySecret) {
        throw new UnauthorizedException('تنسيق مفتاح API غير صالح');
      }

      // Validate API key
      const apiKey = await this.apiKeyService.validate(keyId, keySecret);
      if (!apiKey) {
        throw new UnauthorizedException('مفتاح API غير صالح أو منتهي الصلاحية');
      }

      // Check rate limit
      const canProceed = await this.apiKeyService.checkRateLimit(apiKey);
      if (!canProceed) {
        throw new ForbiddenException('تم تجاوز حد الطلبات. يرجى المحاولة لاحقاً');
      }

      // Attach developer info to request
      req.developer = {
        id: apiKey.developerId,
        keyId: apiKey.keyId,
        permissions: apiKey.permissions,
      };
      req.apiKey = apiKey;

      // Increment developer request count
      await this.developerService.incrementRequests(apiKey.developerId);

      // Log usage after response
      res.on('finish', async () => {
        const responseTime = Date.now() - startTime;
        await this.apiUsageService.log({
          apiKeyId: apiKey._id.toString(),
          developerId: apiKey.developerId,
          endpoint: req.path,
          method: req.method,
          statusCode: res.statusCode,
          responseTime,
          ip: req.ip,
          userAgent: req.headers['user-agent'],
          requestBody: req.body,
          isError: res.statusCode >= 400,
        });
      });

      next();
    } catch (error: any) {
      // Log failed request
      await this.apiUsageService.log({
        apiKeyId: 'unknown',
        developerId: 'unknown',
        endpoint: req.path,
        method: req.method,
        statusCode: 401,
        responseTime: Date.now() - startTime,
        ip: req.ip,
        userAgent: req.headers['user-agent'],
        isError: true,
        errorMessage: error.message,
      });

      throw error;
    }
  }
}
