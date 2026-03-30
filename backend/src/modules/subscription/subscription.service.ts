import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Subscription, SubscriptionDocument, SubscriptionTier, SubscriptionStatus } from './subscription.schema';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectModel(Subscription.name) private subscriptionModel: Model<SubscriptionDocument>,
  ) {}

  async getOrCreateSubscription(userId: string): Promise<SubscriptionDocument> {
    let subscription = await this.subscriptionModel.findOne({ userId });
    if (!subscription) {
      subscription = await this.subscriptionModel.create({
        userId: new Types.ObjectId(userId),
        tier: SubscriptionTier.FREE,
        status: SubscriptionStatus.ACTIVE,
        startDate: new Date(),
      });
    }
    return subscription;
  }

  async getSubscription(userId: string): Promise<SubscriptionDocument> {
    const subscription = await this.getOrCreateSubscription(userId);
    return subscription;
  }

  async upgradeToVIP(userId: string, months: number = 1): Promise<SubscriptionDocument> {
    const subscription = await this.getOrCreateSubscription(userId);
    
    const now = new Date();
    const endDate = subscription.endDate && subscription.endDate > now
      ? new Date(subscription.endDate.getTime() + months * 30 * 24 * 60 * 60 * 1000)
      : new Date(now.getTime() + months * 30 * 24 * 60 * 60 * 1000);

    subscription.tier = SubscriptionTier.VIP;
    subscription.status = SubscriptionStatus.ACTIVE;
    subscription.startDate = now;
    subscription.endDate = endDate;
    subscription.benefits = {
      dailyBoxes: 50,
      discount: 10,
      exclusiveBoxes: true,
      earlyAccess: true,
    };

    await subscription.save();
    return subscription;
  }

  async checkVIPStatus(userId: string): Promise<boolean> {
    const subscription = await this.subscriptionModel.findOne({ userId });
    if (!subscription || subscription.tier === SubscriptionTier.FREE) {
      return false;
    }
    if (subscription.status !== SubscriptionStatus.ACTIVE) {
      return false;
    }
    if (subscription.endDate && subscription.endDate < new Date()) {
      subscription.status = SubscriptionStatus.EXPIRED;
      subscription.tier = SubscriptionTier.FREE;
      await subscription.save();
      return false;
    }
    return true;
  }

  async getBenefits(userId: string): Promise<Record<string, any>> {
    const subscription = await this.getOrCreateSubscription(userId);
    const isVIP = await this.checkVIPStatus(userId);
    
    return {
      tier: subscription.tier,
      isVIP,
      dailyBoxes: isVIP ? 50 : 10,
      discount: isVIP ? 10 : 0,
      exclusiveBoxes: isVIP,
      earlyAccess: isVIP,
    };
  }
}
