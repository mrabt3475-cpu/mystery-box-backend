import { Injectable, Logger } from '@nestjs/common';
import { RewardsService } from './rewards.service';
import { QueueService } from '../../queue/queue.service';

@Injectable()
export class RewardsModule {
  constructor(private rewardsService: RewardsService,
    private queueService: QueueService,
  ) {}

  onModuleInit() {
    this.rewardsService.queueService = this.queueService;
  }
}

