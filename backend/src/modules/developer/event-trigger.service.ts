import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Box, BoxDocument } from '../boxes/box.schema';
import { User, UserDocument } from '../users/user.schema';
import { WebhookEventService } from './webhook-event.service';
import { RewardsService } from '../rewards/rewards.service';

@Injectable()
export class EventTriggerService implements OnModuleInit {
  constructor(
    @InjectModel(Box.name) private boxModel: Model<BoxDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly webhookEventService: WebhookEventService,
    private readonly rewardsService: RewardsService,
  ) {}

  onModuleInit() {
    console.log('📡 Event Trigger Service initialized');
  }

  /**
   * Triggered when a user opens a box
   */
  async onBoxOpened(userId: string, boxId: string, cost: number): Promise<void> {
    const user = await this.userModel.findById(userId);
    const box = await this.boxModel.findById(boxId);

    await this.webhookEventService.trigger('box.opened', {
      userId,
      username: user?.username,
      boxId,
      boxName: box?.name,
      cost,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Triggered when a user wins a prize
   */
  async onBoxWon(userId: string, boxId: string, prize: any): Promise<void> {
    const user = await this.userModel.findById(userId);

    await this.webhookEventService.trigger('box.won', {
      userId,
      username: user?.username,
      boxId,
      prize: prize,
      prizeName: prize.name,
      prizeValue: prize.value,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Triggered when a user loses (doesn't win)
   */
  async onBoxLost(userId: string, boxId: string): Promise<void> {
    const user = await this.userModel.findById(userId);

    await this.webhookEventService.trigger('box.lost', {
      userId,
      username: user?.username,
      boxId,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Triggered when an order is created
   */
  async onOrderCreated(orderId: string, userId: string, totalPoints: number): Promise<void> {
    const user = await this.userModel.findById(userId);

    await this.webhookEventService.trigger('order.created', {
      orderId,
      userId,
      username: user?.username,
      totalPoints,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Triggered when an order is shipped
   */
  async onOrderShipped(orderId: string, trackingNumber: string): Promise<void> {
    await this.webhookEventService.trigger('order.shipped', {
      orderId,
      trackingNumber,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Triggered when an order is delivered
   */
  async onOrderDelivered(orderId: string): Promise<void> {
    await this.webhookEventService.trigger('order.delivered', {
      orderId,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Triggered when points are earned
   */
  async onPointsEarned(userId: string, amount: number, reason: string): Promise<void> {
    const user = await this.userModel.findById(userId);

    await this.webhookEventService.trigger('points.earned', {
      userId,
      username: user?.username,
      amount,
      reason,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Triggered when points are deducted
   */
  async onPointsDeducted(userId: string, amount: number, reason: string): Promise<void> {
    const user = await this.userModel.findById(userId);

    await this.webhookEventService.trigger('points.deducted', {
      userId,
      username: user?.username,
      amount,
      reason,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Triggered when a daily bonus is claimed
   */
  async onDailyBonus(userId: string, amount: number, streak: number): Promise<void> {
    const user = await this.userModel.findById(userId);

    await this.webhookEventService.trigger('daily.bonus', {
      userId,
      username: user?.username,
      amount,
      streak,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Triggered when a referral bonus is earned
   */
  async onReferralBonus(userId: string, referredUserId: string, amount: number): Promise<void> {
    const user = await this.userModel.findById(userId);

    await this.webhookEventService.trigger('referral.bonus', {
      userId,
      username: user?.username,
      referredUserId,
      amount,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Triggered when a reward is created
   */
  async onRewardCreated(userId: string, reward: any): Promise<void> {
    await this.webhookEventService.trigger('reward.created', {
      userId,
      reward,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Triggered when a reward is claimed
   */
  async onRewardClaimed(userId: string, rewardId: string, reward: any): Promise<void> {
    await this.webhookEventService.trigger('reward.claimed', {
      userId,
      rewardId,
      reward,
      timestamp: new Date().toISOString(),
    });
  }
}
