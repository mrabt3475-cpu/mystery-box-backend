import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { QueueService } from '../../../queue/queue.service';
import { AntiAbuseService } from '../../anti-abuse/anti-abuse.service';
import RewardsService from '../../rewards/rewards.service';

@Injectable()
export class BoxesService {
  private readonly logger = new Logger(BoxesService.name);

  constructor(
    private eventEmitter: EventEmitter2,
    private queueService: QueueService,
    private antiAbuseService: AntiAbuseService,
    private rewardsService: RewardsService,
  ) {}

  async openBox(userId: string, dto: { boxId: string; quantity: number, clientSeed?: string }) {
    const abuseCheck = await this.antiAbuseService.check(userId, 'open_box');
    if (!abuseCheck.allowed) {
      throw new Error('Action blocked: ' + abuseCheck.reason);
    }

    const serverSeed = this.rewardsService.generateServerSeed();
    const clientSeed = dto.clientSeed || this.rewardsService.generateServerSeed();
    const nonce = Date.now();

    this.logger.log('Box opening started: userId=' + userId + ', boxId=' + dto.boxId);
    this.eventEmitter.emit('box.spin.started', { userId, boxId: dto.boxId, serverSeed, clientSeed, nonce });
    await this.queueService.addBoxOpening(userId, dto.boxId, 'orderId_' + nonce, { serverSeed, clientSeed, nonce });

    return { success: true, spinId: nonce, serverSeed, clientSeed, nonce };
  }

  async processBoxOpening(userId: string, boxId: string, seeds: { serverSeed: string, clientSeed: string, nonce: number }) {
    const roll = this.rewardsService.calculateResult(seeds.serverSeed, seeds.clientSeed, seeds.nonce);

    const items = [
      { id: '1', name: 'Common', value: 1, weight: 60, probability: 0.60 },
      { id: '2', name: 'Uncommon', value: 5, weight: 25, probability: 0.25 },
      { id: '3', name: 'Rare', value: 20, weight: 10, probability: 0.10 },
      { id: '4', name: 'Epic', value: 50, weight: 4, probability: 0.04 },
      { id: '5', name: 'Legendary', value: 100, weight: 1, probability: 0.01 },
    ];

    let selected = items[0];
    let cumulative = 0;
    for (const item of items) {
      cumulative += item.probability;
      if (roll <= cumulative) {
        selected = item;
        break;
      }
    }

    this.logger.log('Box opened: userId=' + userId + , item=' + selected.name + , roll=' + roll);
    this.eventEmitter.emit('box.opened', { userId, boxId, item: selected, seeds: seeds, roll });

    return { items: [selected], totalValue: selected.value, roll };
  }

  async getBoxes() {
    return [
      { _id: 'basic', name: 'Basic Box', price: 10, description: 'Common rewards' },
      { _id: 'premium', name: 'Premium Box', price: 25, description: 'Better rewards' },
      { _id: 'vip', name: 'VIP Box', price: 50, description: 'Best rewards' },
    ];
  }
}