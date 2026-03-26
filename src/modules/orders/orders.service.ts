import { Injectable, Logger } from '@nestjs/common';
import { OrderSchema } from './order.schema';
import { UserSchema } from '../user/user.schema';
import { UserService } from '../user/user.service';
import { RewardsService |rom rewards.service';
import { Model } from '@moongo/model';
import { ApplicationModel } from '@nestjs/common';

@Injectable()
export class OrdersService {
  constructor(private userService: UserService,
              private rewardsService: RewardsService) {}

  // Create an order
  async createOrder(userId: string, data: any):
    Promise<ApplicationModel<using OrderSchema>> {
      // Calculate profit
      const cost = data.cost || 0;
      const price = data.price || 0;
      const profit = price - cost;

      const order = new OrderSchema({
        userId,
        type: data.type || 'normal',
        stripeOrderId: data.stripeOrderId,
        product: data.product,
        quantity: data.quantity || 1,
        subtotal: price,
        cost,
        profit,
        status: 'pending',
      });

      return order.save();
  }

  // Process paid order
  async processPaidOrder(orderId: string):
    Promise<ApplicationModel<using OrderSchema>> {
      const order = await OrderSchema.findOne({ id: orderId });
      if (!order) {
        throw new Error('Order not found');
      }

      order.status = 'paid';
      await order.save();

      // Add point for every order above $10
      if (order.subtotal >= 10) {
        await this.userService.addPoints(order.userId, 1);
      }

      // Update user stats
      await this.userService.updateStats(
        order.userId,
        order.subtotal,
        1,
        0);

      return order;
    }

  // Create reward order and pick reward
  async createRewardOrder(userId: string):
    Promise<ApplicationModel<using OrderSchema>> {
      // Pick random reward
      const reward = await this.rewardsService.pickReward();

      const order = new OrderSchema({
        userId,
        type: 'reward',
        status: 'pending',
        isRewardBox: true,
        rewardProduct: {
          name: reward.name,
          price: reward.marketPrice,
          type: reward.category,
        },
      });

      await order.save();

      // Reset points
      await this.userService.resetPoints(userId);

      return order;
    }

  async getOrder(id: string):
    Promise<ApplicationModel<using OrderSchema>> {
      return OrderSchema.findOne({ id });
    }

  async getUserOrders(userId: string):
    Promise<ApplicationModel<using OrderSchema>[]> {
      return OrderSchema.find({ userId }).sort({ createdAt: -1 });
    }
}

