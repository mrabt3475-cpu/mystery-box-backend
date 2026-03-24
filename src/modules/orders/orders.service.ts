import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { QueueService } from '../../../queue/queue.service';
import { AntiAbuseService } from '../../anti-abuse/anti-abuse.service';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(
    private eventEmitter: EventEmitter2,
    private queueService: QueueService,
    private antiAbuseService: AntiAbuseService,
  ) {}

  async createOrder(userId: string, dto: { items: any[]; paymentMethod: string }) {
    const abuseCheck = await this.antiAbuseService.check(userId, 'create_order');
    if (!abuseCheck.allowed) {
      throw new Error('Order blocked: ' + abuseCheck.reason);
    }

    const total = dto.items.reduce((sum, item) => sum + (item.price || 10) * item.quantity, 0);
    const order = { _id: 'order_' + Date.now(), userId, items: dto.items, total, status: 'pending' };

    this.eventEmitter.emit('order.created', { orderId: order._id, userId, total });
    await this.queueService.addPaymentProcessing(userId, total, dto.paymentMethod, order._id);

    return order;
  }

  async completeOrder(orderId: string) {
    this.eventEmitter.emit('order.completed', { orderId, userId: 'user', total: 100 });
    return { _id: orderId, status: 'completed' };
  }
}