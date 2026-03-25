import { Module } from '@nestjs/common';
import BoxesService from './boxes.service';
import AntiAbuseModule from '../anti-abuse/anti-abuse.module';
import RewardsModule from '../rewards/rewards.module';

@Module({
  imports: [AntiAbuseModule, RewardsModule],
  providers: [BoxesService],
  exports: [BoxesService],
})
export class BoxesModule {}