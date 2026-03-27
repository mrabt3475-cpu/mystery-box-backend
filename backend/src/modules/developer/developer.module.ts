import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DeveloperController } from './developer.controller';
import { PublicApiController } from './public-api.controller';
import { DeveloperService } from './developer.service';
import { ApiKeyService } from './api-key.service';
import { ApiUsageService } from './api-usage.service';
import { WebhookService } from './webhook.service';
import { WebhookLogService } from './webhook-log.service';
import { ApiGatewayMiddleware } from './api-gateway.middleware';

import { Developer, DeveloperSchema } from './developer.schema';
import { ApiKey, ApiKeySchema } from './api-key.schema';
import { ApiUsage, ApiUsageSchema } from './api-usage.schema';
import { Webhook, WebhookSchema } from './webhook.schema';
import { WebhookLog, WebhookLogSchema } from './webhook-log.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Developer.name, schema: DeveloperSchema },
      { name: ApiKey.name, schema: ApiKeySchema },
      { name: ApiUsage.name, schema: ApiUsageSchema },
      { name: Webhook.name, schema: WebhookSchema },
      { name: WebhookLog.name, schema: WebhookLogSchema },
    ]),
  ],
  controllers: [DeveloperController, PublicApiController],
  providers: [
    DeveloperService,
    ApiKeyService,
    ApiUsageService,
    WebhookService,
    WebhookLogService,
    ApiGatewayMiddleware,
  ],
  exports: [
    DeveloperService,
    ApiKeyService,
    ApiUsageService,
    WebhookService,
    ApiGatewayMiddleware,
  ],
})
export class DeveloperModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ApiGatewayMiddleware)
      .exclude('/api/auth/*', '/api/developer/*')
      .forRoutes('*');
  }
}
