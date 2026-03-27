import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ApiUsage, ApiUsageDocument } from './api-usage.schema';

@Injectable()
export class ApiUsageService {
  constructor(
    @InjectModel(ApiUsage.name) private apiUsageModel: Model<ApiUsageDocument>,
  ) {}

  async log(data: {
    apiKeyId: string;
    developerId: string;
    endpoint: string;
    method: string;
    statusCode: number;
    responseTime: number;
    ip?: string;
    userAgent?: string;
    requestBody?: Record<string, any>;
    responseBody?: Record<string, any>;
    isError?: boolean;
    errorMessage?: string;
  }): Promise<ApiUsage> {
    const usage = new this.apiUsageModel(data);
    return usage.save();
  }

  async getDeveloperUsage(
    developerId: string,
    startDate?: Date,
    endDate?: Date,
    limit = 100,
  ): Promise<ApiUsage[]> {
    const query: any = { developerId };

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = startDate;
      if (endDate) query.createdAt.$lte = endDate;
    }

    return this.apiUsageModel
      .find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  }

  async getKeyUsage(
    apiKeyId: string,
    startDate?: Date,
    endDate?: Date,
    limit = 100,
  ): Promise<ApiUsage[]> {
    const query: any = { apiKeyId };

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = startDate;
      if (endDate) query.createdAt.$lte = endDate;
    }

    return this.apiUsageModel
      .find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  }

  async getUsageStats(developerId: string, days = 30): Promise<{
    totalRequests: number;
    successRequests: number;
    failedRequests: number;
    avgResponseTime: number;
    topEndpoints: { endpoint: string; count: number }[];
  }> {
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const totalRequests = await this.apiUsageModel.countDocuments({
      developerId,
      createdAt: { $gte: startDate },
    });

    const successRequests = await this.apiUsageModel.countDocuments({
      developerId,
      statusCode: { $gte: 200, $lt: 400 },
      createdAt: { $gte: startDate },
    });

    const failedRequests = await this.apiUsageModel.countDocuments({
      developerId,
      statusCode: { $gte: 400 },
      createdAt: { $gte: startDate },
    });

    const avgResponseTime = await this.apiUsageModel.aggregate([
      { $match: { developerId, createdAt: { $gte: startDate } } },
      { $group: { _id: null, avg: { $avg: '$responseTime' } } },
    ]);

    const topEndpoints = await this.apiUsageModel.aggregate([
      { $match: { developerId, createdAt: { $gte: startDate } } },
      { $group: { _id: '$endpoint', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
      { $project: { endpoint: '$_id', count: 1, _id: 0 } },
    ]);

    return {
      totalRequests,
      successRequests,
      failedRequests,
      avgResponseTime: avgResponseTime[0]?.avg || 0,
      topEndpoints,
    };
  }

  async getHourlyUsage(developerId: string, hours = 24): Promise<any[]> {
    const startDate = new Date(Date.now() - hours * 60 * 60 * 1000);

    return this.apiUsageModel.aggregate([
      {
        $match: {
          developerId,
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d %H:00', date: '$createdAt' },
          },
          requests: { $sum: 1 },
          avgResponseTime: { $avg: '$responseTime' },
        },
      },
      { $sort: { _id: 1 } },
    ]);
  }
}
