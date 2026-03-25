import { Module } from '@nestjs/common';
import { BoxesController } from './boxes.controller';
import BoxesService from './boxes.service';
import AntiAbuseModule from '../anti-abuse/anti-abuse.module';
import RewardsModule from '../rewards/rewards.module';

@Module({
  imports: [AntiAbuseModule, RewardsModule],
  controllers: [BoxesController],
  providers: [BoxesService],
  exports: [BoxesService],
})
export class BoxesModule {}

