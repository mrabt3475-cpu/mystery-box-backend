import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AbuseLog, AbuseLogDocument } from './abuse-log.schema';

@Injectable()
export class AntiAbuseService {
  constructor(
    @InjectModel(AbuseLog.name) private abuseLogModel: Model<AbuseLogDocument>,
  ) {}

  async logAction(
    userId: string,
    ip: string,
    action: string,
    details?: string,
    isBot = false,
    userAgent?: string,
  ): Promise<void> {
    const log = new this.abuseLogModel({
      userId,
      ip,
      action,
      details,
      isBot,
      userAgent,
      createdAt: new Date(),
    });

    await log.save();
  }

  async isBot(userAgent: string): Promise<boolean> {
    const botPatterns = [
      /bot/i,
      /spider/i,
      /crawler/i,
      /curl/i,
      /wget/i,
      /headless/i,
      /puppeteer/i,
      /selenium/i,
    ];

    return botPatterns.some(pattern => pattern.test(userAgent));
  }

  async checkRateLimit(userId: string, action: string, limit: number, windowMs: number): Promise<boolean> {
    const windowStart = new Date(Date.now() - windowMs);

    const count = await this.abuseLogModel.countDocuments({
      userId,
      action,
      createdAt: { $gte: windowStart },
    });

    return count >= limit;
  }

  async getUserAbuseHistory(userId: string): Promise<AbuseLog[]> {
    return this.abuseLogModel
      .find({ userId })
      .sort({ createdAt: -1 })
      .limit(50)
      .exec();
  }

  async getSuspiciousUsers(): Promise<string[]> {
    const suspicious = await this.abuseLogModel.aggregate([
      { $match: { isBot: true } },
      { $group: { _id: '$userId', count: { $sum: 1 } } },
      { $match: { count: { $gte: 5 } } },
    ]);

    return suspicious.map(s => s._id);
  }
}
