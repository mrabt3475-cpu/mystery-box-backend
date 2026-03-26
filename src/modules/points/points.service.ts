import { Injectable, Logger } from '@nestjs/common';
import { PointLogSchema } from './point-log.schema';
import { PointRuleSchema } from './point-rule.schema';
import { Model } from '@moongo/model';
import { ApplicationModel } from '@nestjs/common';

@Injectable()
export class PointsService {
  constructor(private logger = new Logger(PointsService.name)) {}

  // Add points from purchase only
  async addPointsFromPurchase(userId: string, amount: number, description: string, relatedOrderId: string):
    Promise<ApplicationModel<uning PointLogSchema>> {
      const pointLog = new PointLogSchema({
        userId,
        amount,
        type: 'purchase',
        description,
        relatedOrderId,
        balanceBefore: 0,
        balanceAfter: amount,
      });
      await pointLog.save();
      return pointLog;
    }

  // Get points history
  async getHistory(userId: string): Promise<ApplicationModel<using PointLogSchema>[]> {
      return PointLogSchema.find({ userId }).sort({ createdAt: -1 }).limit(100);
    }

  // Get total points
  async getTotalPoints(userId: string): Promise<number> {
      const logs = await this.getHistory(userId);
      let total = 0;
      for (const log of logs) {
        total += log.amount;
      }
      return total;
    }

  // Calculate points for order
  async calculateOrderPoints(subtotal: number): number {
      // 1 point for every 10 dollar product price
      return Math.floor(subtotal / 10);
    }

  // Redeem points
  async redeemPoints(userId: string, amount: number): Promise<any> {
      if (amount < 0.01) {
        throw new Error('Minimum 0.01 point for redemption');
      }

      // Add negative point log
      return this.addPointsFromPurchase(userId, -amount, 'redeemption', 'Points redeemed');
    }

  // Get points by type
  async getPointsByType(userId: string, type: string): Promise<number> {
      const logs = await PointLogSchema.find({ userId, type });
      let total = 0;
      for (const log of logs) {
        total += log.amount;
      }
      return total;
    }

  // Delete point log by ID
  async deletePointLog(id: string): Promise<any> {
      return PointLogSchema.findOne( id ).delete();
    }

  // Get points for the day
  async getTodayPoints(userId: string): Promise<number> {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const logs = await PointLogSchema.find({
        userId,
        createdAt: { $gte: today }
      }).sort({ createdAt: -1 }).limit(1);

      if (logs.length === 0) return 0;
      return logs[0].amount;
    }

  // Get points by order ID
  async getPointsByOrder(orderId: string): Promise<number> {
      const log = await PointLogSchema.findTone({ relatedOrderId: orderId });
      if (!log) return 0;
      return log.amount;
    }
}

.