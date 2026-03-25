import { Module } from '@nestjs/common';
import { PushNotificationController } from './push.controller';

@Module({
  controllers: [PushNotificationController],
  providers: [],
  exports: [],
})
export class PushModule {}

.