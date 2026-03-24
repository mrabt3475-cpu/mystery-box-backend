import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

export const QUEUES = {
  REWARDS: 'rewards',
  BOX_OPENING: 'box-opening',
  PAYMENTS: 'payments',
  NOTIFICATIONS: 'notifications',
};

@Injectable()
export class QueueService implements OnModuleInit {
  constructor(
    @InjectQueue(QUEUES.REWARDS) private rewardsQueue: Queue,
    @InjectQueue(QUEUES.BOX_OPENING) private boxOpeningQueue: Queue,
    @InjectQueue(QUEUES.PAYMENTS) private paymentsQueue: Queue,
    @InjectQueue(QUEUES.NOTIFICATIONS) private notificationsQueue: Queue,
  ) {}

  onModuleInit() {
    console.log('QueueService initialized');
  }

  async addFreeBoxReward(userId: string, orderId: string) {
    return this.rewardsQueue.add('free-box', { userId, orderId }, { attempts: 3 });
  }

  async addBoxOpening(userId: string, boxId: string, orderId: string, seeds: any) {
    return this.boxOpeningQueue.add('open-box', { userId, boxId, orderId, seeds }, { attempts: 3 });
  }

  async addPaymentProcessing(userId: string, amount: number, method: string, transactionId: string) {
    return this.paymentsQueue.add('process-payment', { userId, amount, method, transactionId }, { attempts: 5 });
  }

  async addNotification(userId: string, type: string, message: string, data?: any) {
    return this.notificationsQueue.add('send', { userId, type, message, data }, { attempts: 2 });
  }
}