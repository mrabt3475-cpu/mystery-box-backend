import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { QueueService } from '../../../queue/queue.service';
import { AntiAbuseService } from '../../anti-abuse/anti-abuse.service';

@Injectable()
export class BoxesService {
  private readonly logger = new Logger(BoxesService.name);

  constructor(
    private eventEmitter: EventEmitter2,
    private queueService: QueueService,
    private antiAbuseService: AntiAbuseService,
  ) {}

  async openBox(userId: string, dto: { boxId: string; quantity: number; clientSeed?: string }) {
    const abuseCheck = await this.antiAbuseService.check(userId, 'open_box');
    if (!abuseCheck.allowed) {
      throw new Error('Action blocked: ' + abuseCheck.reason);
    }

    const serverSeed = 'seed_' + Date.now();
    const clientSeed = dto.clientSeed || 'client_' + Date.now();
    const nonce = Date.now();

    this.eventEmitter.emit('box.spin.started', { userId, boxId: dto.boxId, serverSeed, clientSeed, nonce });
    await this.queueService.addBoxOpening(userId, dto.boxId, 'orderId', { serverSeed, clientSeed, nonce });

    return { success: true, spinId: nonce, serverSeed, clientSeed, nonce };
  }

  async processBoxOpening(userId: string, boxId: string, seeds: any) {
    const items = [
      { id: '1', name: 'Common', value: 1, weight: 60 },
      { id: '2', name: 'Uncommon', value: 5, weight: 25 },
      { id: '3', name: 'Rare', value: 20, weight: 10 },
      { id: '4', name: 'Epic', value: 50, weight: 4 },
      { id: '5', name: 'Legendary', value: 100, weight: 1 },
    ];
    const roll = Math.random() * 100;
    let selected = items[0];
    let cumulative = 0;
    for (const item of items) {
      cumulative += item.weight;
      if (roll <= cumulative) { selected = item; break; }
    }

    this.eventEmitter.emit('box.opened', { userId, boxId, item: selected, seeds });
    return { items: [selected], totalValue: selected.value };
  }

  async getBoxes() {
    return [
      { _id: 'basic', name: 'Basic Box', price: 10 },
      { _id: 'premium', name: 'Premium Box', price: 25 },
      { _id: 'vip', name: 'VIP Box', price: 50 },
    ];
  }
}