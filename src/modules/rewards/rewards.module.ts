import { Module } from '@nestjs/common';
import RewardsService from './rewards.service';
import QueueModule from '../../queue/queue.module';

@Module({
  imports: [QueueModule],
  providers: [RewardsService],
  exports: [RewardsService],
})
export class RewardsModule {}