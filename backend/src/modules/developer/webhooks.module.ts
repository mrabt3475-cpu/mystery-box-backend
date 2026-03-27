import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WebhookService } from './webhook.service';
import { WebhookEventService } from './webhook-event.service';
import { WebhookLogService } from './webhook-log.service';
import { WebhooksController } from './webhooks.controller';

import { Webhook, WebhookSchema } from './webhook.schema';
import { WebhookLog, WebhookLogSchema } from './webhook-log.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Webhook.name, schema: WebhookSchema },
      { name: WebhookLog.name, schema: WebhookLogSchema },
    ]),
  ],
  controllers: [WebhooksController],
  providers: [
    WebhookService,
    WebhookEventService,
    WebhookLogService,
  ],
  exports: [
    WebhookService,
    WebhookEventService,
  ],
})
export class WebhooksModule {}
