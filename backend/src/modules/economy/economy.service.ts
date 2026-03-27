import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ClientSession } from 'mongoose';
import { Transaction, TransactionDocument, TransactionType } from './transaction.schema';
import { UsersService } from '../users/users.service';

@Injectable()
export class EconomyService {
  constructor(
    @InjectModel(Transaction.name) private transactionModel: Model<TransactionDocument>,
    private readonly usersService: UsersService,
  ) {}

  /**
   * Add points to user with transaction
   */
  async addPoints(
    userId: string,
    amount: number,
    type: TransactionType,
    metadata?: Record<string, any>,
  ): Promise<Transaction> {
    if (amount <= 0) {
      throw new BadRequestException('المبلغ يجب أن يكون أكبر من صفر');
    }

    // Create transaction record
    const transaction = new this.transactionModel({
      userId,
      amount,
      type,
      balanceAfter: 0, // Will be updated after user update
      metadata,
      status: 'completed',
    });

    // Update user points atomically
    const user = await this.usersService.atomicIncrement(userId, 'points', amount);
    if (!user) {
      throw new BadRequestException('المستخدم غير موجود');
    }

    // Update transaction with new balance
    transaction.balanceAfter = user.points;
    await transaction.save();

    // Update total points earned
    await this.usersService.atomicIncrement(userId, 'totalPointsEarned', amount);

    return transaction;
  }

  /**
   * Deduct points from user with transaction
   */
  async deductPoints(
    userId: string,
    amount: number,
    type: TransactionType,
    metadata?: Record<string, any>,
  ): Promise<Transaction> {
    if (amount <= 0) {
      throw new BadRequestException('المبلغ يجب أن يكون أكبر من صفر');
    }

    // Check if user has enough points
    const hasEnough = await this.hasEnoughPoints(userId, amount);
    if (!hasEnough) {
      throw new BadRequestException('النقاط غير كافية');
    }

    // Create transaction record
    const transaction = new this.transactionModel({
      userId,
      amount: -amount,
      type,
      balanceAfter: 0,
      metadata,
      status: 'completed',
    });

    // Update user points atomically
    const user = await this.usersService.atomicDecrement(userId, 'points', amount);
    if (!user) {
      throw new BadRequestException('المستخدم غير موجود');
    }

    // Update transaction with new balance
    transaction.balanceAfter = user.points;
    await transaction.save();

    return transaction;
  }

  /**
   * Check if user has enough points
   */
  async hasEnoughPoints(userId: string, amount: number): Promise<boolean> {
    const user = await this.usersService.findById(userId);
    if (!user) {
      return false;
    }
    return user.points >= amount;
  }

  /**
   * Get user points
   */
  async getUserPoints(userId: string): Promise<{ points: number; balance: number }> {
    const user = await this.usersService.findById(userId);
    if (!user) {
      return { points: 0, balance: 0 };
    }
    return { points: user.points, balance: user.balance };
  }

  /**
   * Get user transactions
   */
  async getTransactions(
    userId: string,
    limit = 20,
    offset = 0,
  ): Promise<Transaction[]> {
    return this.transactionModel
      .find({ userId })
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .exec();
  }

  /**
   * Increment boxes opened counter
   */
  async incrementBoxesOpened(userId: string): Promise<void> {
    await this.usersService.atomicIncrement(userId, 'boxesOpened', 1);
  }

  /**
   * Increment wins counter
   */
  async incrementWins(userId: string): Promise<void> {
    await this.usersService.atomicIncrement(userId, 'totalWins', 1);
  }

  /**
   * Get daily points limit
   */
  async getDailyPointsLimit(userId: string): Promise<number> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayTransactions = await this.transactionModel
      .find({
        userId,
        type: 'purchase',
        createdAt: { $gte: today },
      })
      .exec();

    const todayPoints = todayTransactions.reduce(
      (sum, t) => sum + (t.type === 'purchase' ? t.amount : 0),
      0,
    );

    const dailyLimit = 10000; // Max points from purchases per day
    return Math.max(0, dailyLimit - todayPoints);
  }
}
