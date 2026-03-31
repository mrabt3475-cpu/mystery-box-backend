import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../users/user.schema';
import { Box, BoxDocument } from '../boxes/box.schema';
import { Prize, PrizeDocument } from '../boxes/prize.schema';
import { Transaction, TransactionDocument } from '../wallet/transaction.schema';
import { CacheService } from '../cache/cache.service';
import { WebsocketGateway } from '../websocket/websocket.gateway';

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Box.name) private boxModel: Model<BoxDocument>,
    @InjectModel(Prize.name) private prizeModel: Model<PrizeDocument>,
    @InjectModel(Transaction.name) private transactionModel: Model<TransactionDocument>,
    private cacheService: CacheService,
    private wsGateway: WebsocketGateway,
  ) {}

  // ========== Stats ==========
  async getStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [totalUsers, newUsersToday, totalBoxesOpened, boxesOpenedToday,
           totalRevenue, revenueToday, totalPrizes, prizesToday] = await Promise.all([
      this.userModel.countDocuments(),
      this.userModel.countDocuments({ createdAt: { $gte: today } }),
      this.userModel.aggregate([{ $group: { _id: null, total: { $sum: '$stats.boxesOpened' } } }]),
      this.transactionModel.countDocuments({ type: 'box_open', createdAt: { $gte: today } }),
      this.transactionModel.aggregate([{ $match: { type: { $in: ['deposit', 'purchase'] } } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
      this.transactionModel.aggregate([{ $match: { type: { $in: ['deposit', 'purchase'] }, createdAt: { $gte: today } } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
      this.userModel.aggregate([{ $group: { _id: null, total: { $sum: '$stats.totalPrizeValue' } } }]),
      this.transactionModel.countDocuments({ type: 'prize_win', createdAt: { $gte: today } }),
    ]);

    return {
      totalUsers,
      newUsersToday,
      totalBoxesOpened: totalBoxesOpened[0]?.total || 0,
      boxesOpenedToday,
      totalRevenue: totalRevenue[0]?.total || 0,
      revenueToday: revenueToday[0]?.total || 0,
      totalPrizes: totalPrizes[0]?.total || 0,
      prizesToday,
    };
  }

  // ========== Users ==========
  async getUsers(page: number, limit: number, search: string, filter: string) {
    const query: any = {};

    // Search filter
    if (search) {
      query.$or = [
        { username: { $regex: search, $options: 'i' } },
        { telegramId: { $regex: search, $options: 'i' } },
        { firstName: { $regex: search, $options: 'i' } },
      ];
    }

    // Status filter
    if (filter === 'active') {
      query.isActive = true;
    } else if (filter === 'banned') {
      query.isActive = false;
    } else if (filter === 'vip') {
      query.isVip = true;
    }

    const [users, total] = await Promise.all([
      this.userModel
        .find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .select('-__v'),
      this.userModel.countDocuments(query),
    ]);

    return {
      users,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getUserById(id: string) {
    const user = await this.userModel.findById(id).select('-__v');
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateUser(id: string, updateData: any) {
    const user = await this.userModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true },
    );

    if (!user) throw new NotFoundException('User not found');

    this.logger.log(`User ${id} updated by admin`);
    return user;
  }

  async deleteUser(id: string) {
    const user = await this.userModel.findByIdAndDelete(id);
    if (!user) throw new NotFoundException('User not found');

    this.logger.log(`User ${id} deleted by admin`);
    return { success: true, message: 'User deleted' };
  }

  // ========== Boxes ==========
  async getAllBoxes() {
    return this.boxModel.find().sort({ price: 1 });
  }

  async createBox(boxData: any) {
    const box = new this.boxModel({
      ...boxData,
      isActive: true,
      totalOpened: 0,
    });

    await box.save();
    this.logger.log(`Box created: ${box.name}`);
    return box;
  }

  async updateBox(id: string, updateData: any) {
    const box = await this.boxModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true },
    );

    if (!box) throw new NotFoundException('Box not found');

    this.logger.log(`Box ${id} updated by admin`);
    return box;
  }

  async deleteBox(id: string) {
    const box = await this.boxModel.findByIdAndDelete(id);
    if (!box) throw new NotFoundException('Box not found');

    this.logger.log(`Box ${id} deleted by admin`);
    return { success: true, message: 'Box deleted' };
  }

  // ========== Prizes ==========
  async getAllPrizes() {
    return this.prizeModel.find().sort({ rarity: 1, value: -1 });
  }

  async createPrize(prizeData: any) {
    const prize = new this.prizeModel(prizeData);
    await prize.save();
    this.logger.log(`Prize created: ${prize.name}`);
    return prize;
  }

  async updatePrize(id: string, updateData: any) {
    const prize = await this.prizeModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true },
    );

    if (!prize) throw new NotFoundException('Prize not found');
    return prize;
  }

  async deletePrize(id: string) {
    const prize = await this.prizeModel.findByIdAndDelete(id);
    if (!prize) throw new NotFoundException('Prize not found');
    return { success: true, message: 'Prize deleted' };
  }

  // ========== Transactions ==========
  async getTransactions(page: number, limit: number) {
    const [transactions, total] = await Promise.all([
      this.transactionModel
        .find()
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('userId', 'username telegramId'),
      this.transactionModel.countDocuments(),
    ]);

    return {
      transactions,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  // ========== Broadcast ==========
  async broadcastNotification(message: string, type: string = 'info') {
    this.wsGateway.broadcastToAll('notification', {
      message,
      type,
      timestamp: new Date(),
    });

    this.logger.log(`Broadcast sent: ${message}`);
    return { success: true, message: 'Broadcast sent' };
  }

  // ========== System ==========
  async getSystemHealth() {
    const [userCount, boxCount, prizeCount, transactionCount] = await Promise.all([
      this.userModel.countDocuments(),
      this.boxModel.countDocuments(),
      this.prizeModel.countDocuments(),
      this.transactionModel.countDocuments(),
    ]);

    return {
      users: userCount,
      boxes: boxCount,
      prizes: prizeCount,
      transactions: transactionCount,
      uptime: process.uptime(),
      memory: process.memoryUsage(),
    };
  }

  async clearCache() {
    await this.cacheService.flushAll();
    this.logger.log('Cache cleared by admin');
    return { success: true, message: 'Cache cleared' };
  }
}
