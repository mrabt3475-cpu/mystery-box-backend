import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(data: Partial<User>): Promise<User> {
    const user = new this.userModel({
      ...data,
      points: data.points ?? 0,
      balance: data.balance ?? 0,
      level: data.level ?? 1,
      boxesOpened: 0,
      totalWins: 0,
      totalPointsEarned: 0,
      dailyStreak: 0,
      lastDailyReward: null,
      achievements: [],
      inventory: [],
      referralCode: this.generateReferralCode(),
      referredBy: null,
      isVerified: false,
      isBanned: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return user.save();
  }

  async findById(id: string): Promise<User | null> {
    return this.userModel.findById(id).exec();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.userModel.findOne({ username }).exec();
  }

  async findByReferralCode(code: string): Promise<User | null> {
    return this.userModel.findOne({ referralCode: code }).exec();
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    const user = await this.userModel
      .findByIdAndUpdate(id, { ...data, updatedAt: new Date() }, { new: true })
      .exec();

    if (!user) {
      throw new NotFoundException('المستخدم غير موجود');
    }

    return user;
  }

  async updateLastLogin(id: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(id, { lastLoginAt: new Date() });
  }

  async atomicIncrement(
    id: string,
    field: string,
    amount: number,
  ): Promise<User | null> {
    return this.userModel
      .findByIdAndUpdate(
        id,
        { $inc: { [field]: amount }, $set: { updatedAt: new Date() } },
        { new: true },
      )
      .exec();
  }

  async atomicDecrement(
    id: string,
    field: string,
    amount: number,
  ): Promise<User | null> {
    return this.userModel
      .findByIdAndUpdate(
        id,
        { $inc: { [field]: -amount }, $set: { updatedAt: new Date() } },
        { new: true },
      )
      .exec();
  }

  async getLeaderboard(limit = 10): Promise<User[]> {
    return this.userModel
      .find({ isBanned: false })
      .sort({ totalWins: -1, boxesOpened: -1 })
      .limit(limit)
      .select('-password -__v')
      .exec();
  }

  async getUserStats(id: string): Promise<any> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('المستخدم غير موجود');
    }

    return {
      totalBoxesOpened: user.boxesOpened,
      totalWins: user.totalWins,
      totalPointsEarned: user.totalPointsEarned,
      currentStreak: user.dailyStreak,
      level: user.level,
      winRate:
        user.boxesOpened > 0
          ? ((user.totalWins / user.boxesOpened) * 100).toFixed(2)
          : 0,
    };
  }

  async addToInventory(userId: string, item: any): Promise<void> {
    await this.userModel.findByIdAndUpdate(userId, {
      $push: { inventory: item },
    });
  }

  async addAchievement(userId: string, achievement: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(userId, {
      $addToSet: { achievements: achievement },
    });
  }

  async checkAndUpdateDailyStreak(userId: string): Promise<number> {
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException('المستخدم غير موجود');
    }

    const now = new Date();
    const lastReward = user.lastDailyReward;

    if (!lastReward) {
      // First daily reward
      await this.userModel.findByIdAndUpdate(userId, {
        dailyStreak: 1,
        lastDailyReward: now,
      });
      return 1;
    }

    const lastRewardDate = new Date(lastReward);
    lastRewardDate.setHours(0, 0, 0, 0);

    const today = new Date(now);
    today.setHours(0, 0, 0, 0);

    const diffDays = Math.floor(
      (today.getTime() - lastRewardDate.getTime()) / (1000 * 60 * 60 * 24),
    );

    let newStreak = user.dailyStreak;

    if (diffDays === 1) {
      // Consecutive day
      newStreak += 1;
    } else if (diffDays > 1) {
      // Streak broken
      newStreak = 1;
    }
    // diffDays === 0 means same day, keep streak

    await this.userModel.findByIdAndUpdate(userId, {
      dailyStreak: newStreak,
      lastDailyReward: now,
    });

    return newStreak;
  }

  private generateReferralCode(): string {
    return 'PC' + Math.random().toString(36).substring(2, 8).toUpperCase();
  }
}
