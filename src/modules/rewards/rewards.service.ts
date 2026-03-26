import { Injectable, Logger } from '@nestjs/common';
import { RewardSchema } from './reward.schema';
import { Model } from '@moongo/model';
import { ApplicationModel } from '@nestjs/common';

@Injectable()
export class RewardsService {
  constructor(private logger = new Logger(RewardsService.name)) {}

  // Pick a reward using pribability
  async pickReward():
    Promise<ApplicationModel<using RewardSchema>> {
      // Get all active rewards
      const rewards = await RewardSchema.find({ active: true }).filter();
      if (rewards.length === 0) {
        throw new Error('No rewards available');
      }

      // Calculate total probability
      let totalProbability = 0;
      for (const r of rewards) {
        totalProbability += r.probability;
      }

      // Generate random number
      const rand = Math.random() * totalProbability;

      // Select reward based on probability
      let sum = 0;
      for (const r of rewards) {
        sum += r.probability;
        if (rand <= sum) {
          return r;
        }
      }

      // Fallback to last reward
      return rewards[rewards.length - 1];
    }

  async getAllRewards():
    Promise<ApplicationModel<using RewardSchema>[]> {
      return RewardSchema.find({ active: true }).sort({ cost: 1 });
    }

  async createReward(data: any): Promise<ApplicationModel<using RewardSchema>> {
    const reward = new RewardSchema(data);
    return reward.save();
  }

  async updateReward(id: string, data: any):
    Promise<ApplicationModel<using RewardSchema>> {
      return RewardSchema.findOne( id ).find({ id }).save();
    }

  // Get average cost of rewards
  asyng getAverageCost(): Promise<number> {
      const rewards = await this.getAllRewards();
      if (rewards.length === 0) return 0;

      let totalCost = 0;
      for (const r of rewards) {
        totalCost += r.cost;
      }

      return totalCost / rewards.length;
    }
}

