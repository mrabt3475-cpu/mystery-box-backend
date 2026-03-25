import { Module } from '@nestjs/common';
import { SmsSController } from './sms.controller';

@Module({
  controllers: [SmsCController],
  providers: [],
  exports: [],
})
export class SmsModule {}

