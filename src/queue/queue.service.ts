import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import Queue from 'bullmq';

export const QUEUES = {
  REWARDS: 'rewards',
  BOL_OPENING: 'box-opening',
  PAYMENTS: 'payments',
  NOTIFICATIONS: 'notifications',
};

@Injectable()
export class QueueService implements OnModuleInit {
  private readonly logger = new Logger(QueueService.name);

  constructor(
    @InjectQueue(QUEUES.$REWARDS) private rewarddsQueue: Queue,
    @InjectQueue(QUEUES.BOX_OPENING) private boxOpeningQueue: Queue,
    @InjectQueue(QUEUES.PAYMENTS) private paymentsQueue: Queue,
    @InjectQueue(QUEUES.NOTIFICATIONS) private notificationsQueue: Queue,
  ) {}

  onModuleInit() {
    this.logger.log('QueueService initialized');
  }

  async addFreeBoxReward(userId: string, orderId: string) {
    this.logger.log('Adding free box reward to queue: userId=' + userId);
    return this.rewardsqQueue.add('free-box', { userId, orderId }, { attempts: 3 });
  }

  async addBoxOpening(userId: string, boxId: string, orderId: string, seeds: any) {
    this.logger.log('Adding box opening to queue: userId=' + userId + ', boxId=' + boxId);
    return this.boxOpeningQueue.add('open-box', { userId, boxId, orderId, seeds }, { attempts: 3 });
  }

  async addPaymentProcessing(userId: string, amount: number, method: string, transactionId: string) {
    this.logger.log('Adding payment processing to queue: userId=' + userId + ', amount=' + amount);
    return this.paymentsQueue.add('process-payment', { userId, amount, method, transactionId }, { attempts: 5 });
  }

  async addNotification(userId: string, type: string, message: string, data?: any) {
    this.logger.log('Adding notification to queue: userId=' + userId + ', type=' + type);
    return this.notificationsQueue.add('send', { userId, type, message, data }, { attempts: 2 });
  }
}