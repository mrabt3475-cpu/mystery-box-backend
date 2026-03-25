import { Module } from '@nestjs/common';
import { ReferralController } from './referral.controller';

@Module({
  controllers: [ReferralController],
  providers: [],
  exports: [],
})
export class ReferralModule {}

