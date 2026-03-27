import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Reward, RewardDocument } from './reward.schema';
import { UsersService } from '../users/users.service';

@Injectable()
export class RewardsService {
  constructor(
    @InjectModel(Reward.name) private rewardModel: Model<RewardDocument>,
    private readonly usersService: UsersService,
  ) {}

  async addRewardToUser(userId: string, prize: any): Promise<Reward> {
    const reward = new this.rewardModel({
      userId,
      type: prize.type || 'prize',
      name: prize.name,
      description: prize.description,
      value: prize.value || 0,
      image: prize.image,
      isClaimed: false,
      createdAt: new Date(),
    });

    await reward.save();

    // Add to user inventory
    await this.usersService.addToInventory(userId, prize);

    return reward;
  }

  async getUserRewards(userId: string): Promise<Reward[]> {
    return this.rewardModel.find({ userId }).sort({ createdAt: -1 }).exec();
  }

  async getUnclaimedRewards(userId: string): Promise<Reward[]> {
    return this.rewardModel
      .find({ userId, isClaimed: false })
      .sort({ createdAt: -1 })
      .exec();
  }

  async claimReward(rewardId: string, userId: string): Promise<Reward> {
    const reward = await this.rewardModel.findOne({
      _id: rewardId,
      userId,
      isClaimed: false,
    });

    if (!reward) {
      throw new NotFoundException('لم يتم العثور على المكافأة');
    }

    reward.isClaimed = true;
    reward.claimedAt = new Date();
    await reward.save();

    return reward;
  }

  async getTotalWinnings(userId: string): Promise<number> {
    const result = await this.rewardModel.aggregate([
      { $match: { userId, isClaimed: true } },
      { $group: { _id: null, total: { $sum: '$value' } } },
    ]);

    return result[0]?.total || 0;
  }
}
