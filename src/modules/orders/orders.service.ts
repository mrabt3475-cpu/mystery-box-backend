import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { QueueService } from '../../../queue/queue.service';
import { AntiAbuseService } from '../../anti-abuse/anti-abuse.service';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  private orders = new Map<string, { _id: string; userId: string; items: any[]; total: number, status: string; createdAt: Date }>();

  constructor(private eventEmitter: EventEmitter2,
    private queueService: QueueService,
    private antiAbuseService: AntiAbuseService,
  ) {}

  async createOrder(userId: string, dto: { items: any[]; paymentMethod: string }) {
    const abuseCheck = await this.antiAbuseService.check(userId, 'create_order');
    if (!abuseCheck.allowed) {
      throw new Error('Order blocked: ' + abuseCheck.reason);
    }

    const total = dto.items.reduce((sum, item) => sum + (item.price || 10) * item.quantity, 0);
    const orderId = 'order_' + Date.now();

    const order = { 
      _id: orderId, 
      userId,
      items: dto.items, 
      total,
      status: 'pending',
      createdAt: new Date()
    };

    this.orders.set(orderId, order);
    this.logger.log('Order created: ' + orderId + ' for user: ' + userId + ', total: ' + total);

    this.eventEmitter.emit('order.created', { orderId, userId, total });
    await this.queueService.addPaymentProcessing(userId, total, dto.paymentMethod, orderId);

    return order;
  }

  async completeOrder(orderId: string) {
    const order = this.orders.get(orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    order.status = 'completed';
    this.orders.set(orderId, order);

    this.logger.log('Order completed: ' + orderId);
    this.eventEmitter.emit('order.completed', { orderId, userId: order.userId, total: order.total });

    return { _id: orderId, status: 'completed', total: order.total };
  }

  async getOrder(orderId: string) {
    return this.orders.get(orderId) || null;
  }

  async getUserOrders(userId: string) {
    const userOrders = [];
    for (const order of this.orders.values()) {
      if (order.userId === userId) {
        userOrders.push(order);
      }
    }
    return userOrders;
  }
}