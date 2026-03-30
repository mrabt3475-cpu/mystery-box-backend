import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Wallet, WalletDocument } from './wallet.schema';
import { Transaction, TransactionDocument } from './transaction.schema';

@Injectable()
export class WalletService {
  constructor(
    @InjectModel(Wallet.name) private walletModel: Model<WalletDocument>,
    @InjectModel(Transaction.name) private transactionModel: Model<TransactionDocument>,
  ) {}

  async getOrCreateWallet(userId: string): Promise<WalletDocument> {
    let wallet = await this.walletModel.findOne({ userId });
    if (!wallet) {
      wallet = await this.walletModel.create({ userId, balance: 0, points: 0 });
    }
    return wallet;
  }

  async getBalance(userId: string): Promise<{ balance: number; points: number }> {
    const wallet = await this.getOrCreateWallet(userId);
    return { balance: wallet.balance, points: wallet.points };
  }

  async deposit(userId: string, amount: number, type: string = 'deposit'): Promise<WalletDocument> {
    if (amount <= 0) {
      throw new BadRequestException('Amount must be positive');
    }

    const wallet = await this.getOrCreateWallet(userId);
    wallet.balance += amount;
    wallet.totalDeposited += amount;

    await this.createTransaction(userId, amount, type, 'credit');
    await wallet.save();

    return wallet;
  }

  async withdraw(userId: string, amount: number, type: string = 'withdraw'): Promise<WalletDocument> {
    if (amount <= 0) {
      throw new BadRequestException('Amount must be positive');
    }

    const wallet = await this.getOrCreateWallet(userId);
    if (wallet.balance < amount) {
      throw new BadRequestException('Insufficient balance');
    }

    wallet.balance -= amount;
    wallet.totalWithdrawn += amount;

    await this.createTransaction(userId, amount, type, 'debit');
    await wallet.save();

    return wallet;
  }

  async addPoints(userId: string, points: number, type: string = 'earned'): Promise<WalletDocument> {
    if (points <= 0) {
      throw new BadRequestException('Points must be positive');
    }

    const wallet = await this.getOrCreateWallet(userId);
    wallet.points += points;

    await this.createTransaction(userId, points, type, 'credit', 'points');
    await wallet.save();

    return wallet;
  }

  async spendPoints(userId: string, points: number, type: string = 'spent'): Promise<WalletDocument> {
    if (points <= 0) {
      throw new BadRequestException('Points must be positive');
    }

    const wallet = await this.getOrCreateWallet(userId);
    if (wallet.points < points) {
      throw new BadRequestException('Insufficient points');
    }

    wallet.points -= points;

    await this.createTransaction(userId, points, type, 'debit', 'points');
    await wallet.save();

    return wallet;
  }

  async getHistory(userId: string, limit: number = 50, skip: number = 0) {
    return this.transactionModel
      .find({ userId: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
  }

  private async createTransaction(
    userId: string,
    amount: number,
    type: string,
    direction: 'credit' | 'debit',
    currency: string = 'USD',
  ): Promise<TransactionDocument> {
    return this.transactionModel.create({
      userId: new Types.ObjectId(userId),
      amount,
      type,
      direction,
      currency,
      status: 'completed',
    });
  }
}
