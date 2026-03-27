import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventTriggerService } from './event-trigger.service';
import { WebhookEventService } from './webhook-event.service';
import { WebhooksModule } from './webhooks.module';

import { Box, BoxSchema } from '../boxes/box.schema';
import { User, UserSchema } from '../users/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Box.name, schema: BoxSchema },
      { name: User.name, schema: UserSchema },
    ]),
    WebhooksModule,
  ],
  providers: [
    EventTriggerService,
    WebhookEventService,
  ],
  exports: [EventTriggerService, WebhookEventService],
})
export class EventsModule {}
