import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { QueueService } from '../../../queue/queue.service';

@Injectable()
export class RewardsService {
  private readonly logger = new Logger(RewardsService.name);

  constructor(private queueService: QueueService) {}

  @OnEvent('order.completed')
  async handleOrderCompleted(event: any) {
    const minPurchase = 50;
    if (event.total >= minPurchase) {
      this.logger.log('User eligible for free box: ' + event.userId);
      await this.queueService.addFreeBoxReward(event.userId, event.orderId);
    }
  }

  async processFreeBoxReward(userId: string, orderId: string) {
    this.logger.log('Free box reward created for user: ' + userId);
    return { userId, orderId, type: 'free_box', status: 'pending' };
  }

  async pickRewardItem(budget: number) {
    const items = [
      { id: '1', name: 'iPhone 15 Pro', value: 999, weight: 1 },
      { id: '2', name: 'AirPods Pro', value: 249, weight: 5 },
      { id: '3', name: '$10 Balance', value: 10, weight: 30 },
      { id: '4', name: '$5 Balance', value: 5, weight: 50 },
    ];
    const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
    let random = Math.random() * totalWeight;
    for (const item of items) {
      random -= item.weight;
      if (random <= 0) return item;
    }
    return items[items.length - 1];
  }
}