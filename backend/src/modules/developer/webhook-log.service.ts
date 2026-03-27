import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { WebhookLog, WebhookLogDocument } from './webhook-log.schema';

@Injectable()
export class WebhookLogService {
  constructor(
    @InjectModel(WebhookLog.name) private webhookLogModel: Model<WebhookLogDocument>,
  ) {}

  async log(data: {
    webhookId: string;
    developerId: string;
    event: string;
    payload: string;
    url: string;
    statusCode: number;
    success: boolean;
    responseBody?: string;
    errorMessage?: string;
    attempts?: number;
    responseTime?: number;
  }): Promise<WebhookLog> {
    const log = new this.webhookLogModel(data);
    return log.save();
  }

  async getWebhookLogs(webhookId: string, limit = 50): Promise<WebhookLog[]> {
    return this.webhookLogModel
      .find({ webhookId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  }

  async getDeveloperLogs(developerId: string, limit = 50): Promise<WebhookLog[]> {
    return this.webhookLogModel
      .find({ developerId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  }

  async getWebhookStats(webhookId: string, days = 7): Promise<{
    totalAttempts: number;
    successCount: number;
    failureCount: number;
    successRate: number;
    avgResponseTime: number;
  }> {
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const totalAttempts = await this.webhookLogModel.countDocuments({
      webhookId,
      createdAt: { $gte: startDate },
    });

    const successCount = await this.webhookLogModel.countDocuments({
      webhookId,
      success: true,
      createdAt: { $gte: startDate },
    });

    const failureCount = await this.webhookLogModel.countDocuments({
      webhookId,
      success: false,
      createdAt: { $gte: startDate },
    });

    const avgResponseTime = await this.webhookLogModel.aggregate([
      { $match: { webhookId, createdAt: { $gte: startDate } } },
      { $group: { _id: null, avg: { $avg: '$responseTime' } } },
    ]);

    return {
      totalAttempts,
      successCount,
      failureCount,
      successRate: totalAttempts > 0 ? (successCount / totalAttempts) * 100 : 0,
      avgResponseTime: avgResponseTime[0]?.avg || 0,
    };
  }
}
