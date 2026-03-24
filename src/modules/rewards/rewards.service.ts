import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { createHash } from 'crypto';
import { QueueService } from '../../../queue/queue.service';

@Injectable()
export class RewardsService {
  private readonly logger = new Logger(RewardsService.name);
  private readonly boxBudgets = {
    basic: 3,
    premium: 8,
    vip: 15,
  };

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

  // Provably Fair RNG using SHA-256
  calculateResult(serverSeed: string, clientSeed: string, nonce: number): number {
    const combined = serverSeed + ':' + clientSeed + ':' + nonce;
    const hash = createHash('sha256').update(combined).digest('hex');
    const num = parseInt(hash.substring(0, 8), 16);
    return (num % 10000) / 100;
  }

  // Pick reward item with budget control
  pickRewardItem(boxType: string): any {
    const budget = this.boxBudgets[boxType] || 3;
    
    const items = [
      { id: '1', name: 'iPhone 15 Pro', value: 999, weight: 1, cost: 900 },
      { id: '2', name: 'AirPods Pro', value: 249, weight: 5, cost: 200 },
      { id: '3', name: '$10 Balance', value: 10, weight: 30, cost: 10 },
      { id: '4', name: '$5 Balance', value: 5, weight: 50, cost: 5 },
    ];

    const affordableItems = items.filter(item => item.cost <= budget * 10);
    const totalWeight = affordableItems.reduce((sum, item) => sum + item.weight, 0);
    
    let random = Math.random() * totalWeight;
    for (const item of affordableItems) {
      random -= item.weight;
      if (random <= 0) return item;
    }
    return affordableItems[affordableItems.length - 1];
  }

  // Calculate expected value for a box
  calculateBoxEV(boxType: string): number {
    const budget = this.boxBudgets[boxType] || 3;
    const items = [
      { id: '1', name: 'iPhone 15 Pro', value: 999, weight: 1, cost: 900 },
      { id: '2', name: 'AirPods Pro', value: 249, weight: 5, cost: 200 },
      { id: '3', name: '$10 Balance', value: 10, weight: 30, cost: 10 },
      { id: '4', name: '$5 Balance', value: 5, weight: 50, cost: 5 },
    ];

    const affordableItems = items.filter(item => item.cost <= budget * 10);
    const totalWeight = affordableItems.reduce((sum, item) => sum + item.weight, 0);
    
    let ev = 0;
    for (const item of affordableItems) {
      const probability = item.weight / totalWeight;
      ev += probability * item.value;
    }
    
    return ev;
  }
}