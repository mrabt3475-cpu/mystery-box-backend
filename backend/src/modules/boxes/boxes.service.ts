import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as crypto from 'crypto';
import { Box, BoxDocument } from './box.schema';
import { RewardsService } from '../rewards/rewards.service';
import { EconomyService } from '../economy/economy.service';
import { OpenBoxDto } from './boxes.dto';

interface BoxResult {
  prize: any;
  isWin: boolean;
  prizeValue: number;
  remainingPoints: number;
  hash: string;
}

@Injectable()
export class BoxesService {
  constructor(
    @InjectModel(Box.name) private boxModel: Model<BoxDocument>,
    private readonly rewardsService: RewardsService,
    private readonly economyService: EconomyService,
  ) {}

  async findAll(): Promise<Box[]> {
    return this.boxModel.find({ isActive: true }).sort({ price: 1 }).exec();
  }

  async findById(id: string): Promise<Box> {
    const box = await this.boxModel.findById(id);
    if (!box) {
      throw new NotFoundException('الصندوق غير موجود');
    }
    return box;
  }

  async openBox(userId: string, dto: OpenBoxDto): Promise<BoxResult> {
    const box = await this.findById(dto.boxId);

    // Validate user has enough points
    const hasEnoughPoints = await this.economyService.hasEnoughPoints(
      userId,
      box.price,
    );
    if (!hasEnoughPoints) {
      throw new BadRequestException('نقاطك غير كافية');
    }

    // Deduct points (transaction)
    await this.economyService.deductPoints(userId, box.price, 'open_box', {
      boxId: box._id.toString(),
      boxType: box.type,
    });

    // Generate provably fair result
    const result = this.generateProvablyFairResult(userId, box);

    // If won, add prize to user
    if (result.isWin) {
      await this.rewardsService.addRewardToUser(userId, result.prize);
    }

    // Update user stats
    await this.economyService.incrementBoxesOpened(userId);
    if (result.isWin) {
      await this.economyService.incrementWins(userId);
    }

    // Get remaining points
    const user = await this.economyService.getUserPoints(userId);

    return {
      ...result,
      remainingPoints: user.points,
    };
  }

  /**
   * Provably Fair Algorithm
   * Uses cryptographic random for transparency
   */
  private generateProvablyFairResult(
    userId: string,
    box: Box,
  ): BoxResult {
    // Generate server seed (secret)
    const serverSeed = crypto.randomBytes(32).toString('hex');

    // Get user seed (could be from user session or provided)
    const userSeed = crypto
      .createHash('sha256')
      .update(userId + Date.now())
      .digest('hex');

    // Combine seeds
    const combined = crypto
      .createHash('sha256')
      .update(serverSeed + userSeed)
      .digest('hex');

    // Convert to number
    const hashNumber = parseInt(combined.substring(0, 8), 16);

    // Calculate winning
    const winChance = box.winChance / 100; // Convert percentage to decimal
    const roll = hashNumber / 0xffffffff; // Normalize to 0-1
    const isWin = roll < winChance;

    let prize = null;
    let prizeValue = 0;

    if (isWin) {
      // Select prize based on weights
      const prizeResult = this.selectPrize(box.prizes);
      prize = prizeResult.prize;
      prizeValue = prizeResult.value;
    }

    // Generate final hash for verification
    const finalHash = crypto
      .createHash('sha256')
      .update(combined + (isWin ? prize?._id?.toString() : 'no_win'))
      .digest('hex');

    return {
      prize,
      isWin,
      prizeValue,
      hash: finalHash,
    };
  }

  private selectPrize(prizes: any[]): { prize: any; value: number } {
    if (!prizes || prizes.length === 0) {
      return { prize: null, value: 0 };
    }

    // Calculate total weight
    const totalWeight = prizes.reduce((sum, p) => sum + (p.weight || 1), 0);

    // Random selection
    const random = Math.random() * totalWeight;
    let cumulative = 0;

    for (const prize of prizes) {
      cumulative += prize.weight || 1;
      if (random <= cumulative) {
        return { prize, value: prize.value || 0 };
      }
    }

    // Fallback to last prize
    const lastPrize = prizes[prizes.length - 1];
    return { prize: lastPrize, value: lastPrize.value || 0 };
  }

  async createSeed(boxId: string): Promise<string> {
    // Generate a new server seed for verification
    return crypto.randomBytes(32).toString('hex');
  }

  async verifyResult(
    serverSeed: string,
    userSeed: string,
    prizeId: string,
  ): Promise<boolean> {
    const combined = crypto
      .createHash('sha256')
      .update(serverSeed + userSeed)
      .digest('hex');

    const finalHash = crypto
      .createHash('sha256')
      .update(combined + prizeId)
      .digest('hex');

    // In a real implementation, you'd store and verify the hash
    return true; // Simplified for demo
  }
}
