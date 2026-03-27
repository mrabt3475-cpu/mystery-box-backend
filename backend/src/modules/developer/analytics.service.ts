import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ApiUsage, ApiUsageDocument } from './api-usage.schema';
import { ApiKey, ApiKeyDocument } from './api-key.schema';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectModel(ApiUsage.name) private apiUsageModel: Model<ApiUsageDocument>,
    @InjectModel(ApiKey.name) private apiKeyModel: Model<ApiKeyDocument>,
  ) {}

  /**
   * Get comprehensive analytics for a developer
   */
  async getDeveloperAnalytics(developerId: string, days = 30) {
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    // Get all API keys for this developer
    const apiKeys = await this.apiKeyModel.find({ developerId });
    const keyIds = apiKeys.map(k => k._id);

    // Basic stats
    const totalRequests = await this.apiUsageModel.countDocuments({
      developerId: { $in: [developerId, ...keyIds.map(String)] },
      createdAt: { $gte: startDate },
    });

    const successRequests = await this.apiUsageModel.countDocuments({
      developerId: { $in: [developerId, ...keyIds.map(String)] },
      statusCode: { $gte: 200, $lt: 400 },
      createdAt: { $gte: startDate },
    });

    const failedRequests = await this.apiUsageModel.countDocuments({
      developerId: { $in: [developerId, ...keyIds.map(String)] },
      statusCode: { $gte: 400 },
      createdAt: { $gte: startDate },
    });

    // Average response time
    const avgResponseTime = await this.apiUsageModel.aggregate([
      {
        $match: {
          developerId: { $in: [developerId, ...keyIds.map(String)] },
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: null,
          avg: { $avg: '$responseTime' },
          min: { $min: '$responseTime' },
          max: { $max: '$responseTime' },
          p50: { $percentile: { percent: 0.5, value: '$responseTime' } },
          p95: { $percentile: { percent: 0.95, value: '$responseTime' } },
          p99: { $percentile: { percent: 0.99, value: '$responseTime' } },
        },
      },
    ]);

    // Top endpoints
    const topEndpoints = await this.apiUsageModel.aggregate([
      {
        $match: {
          developerId: { $in: [developerId, ...keyIds.map(String)] },
          createdAt: { $gte: startDate },
        },
      },
      { $group: { _id: '$endpoint', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    // Status code distribution
    const statusDistribution = await this.apiUsageModel.aggregate([
      {
        $match: {
          developerId: { $in: [developerId, ...keyIds.map(String)] },
          createdAt: { $gte: startDate },
        },
      },
      {
        $bucket: {
          groupBy: '$statusCode',
          boundaries: [200, 300, 400, 500, 600],
          default: 'other',
          output: { count: { $sum: 1 } },
        },
      },
    ]);

    // Daily usage
    const dailyUsage = await this.apiUsageModel.aggregate([
      {
        $match: {
          developerId: { $in: [developerId, ...keyIds.map(String)] },
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          requests: { $sum: 1 },
          avgResponseTime: { $avg: '$responseTime' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Hourly distribution
    const hourlyDistribution = await this.apiUsageModel.aggregate([
      {
        $match: {
          developerId: { $in: [developerId, ...keyIds.map(String)] },
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: { $hour: '$createdAt' },
          requests: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Error analysis
    const errors = await this.apiUsageModel.aggregate([
      {
        $match: {
          developerId: { $in: [developerId, ...keyIds.map(String)] },
          statusCode: { $gte: 400 },
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: { endpoint: '$endpoint', statusCode: '$statusCode' },
          count: { $sum: 1 },
          lastError: { $last: '$errorMessage' },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    return {
      summary: {
        totalRequests,
        successRequests,
        failedRequests,
        successRate: totalRequests > 0 ? (successRequests / totalRequests) * 100 : 0,
        avgResponseTime: avgResponseTime[0]?.avg || 0,
        minResponseTime: avgResponseTime[0]?.min || 0,
        maxResponseTime: avgResponseTime[0]?.max || 0,
        p50ResponseTime: avgResponseTime[0]?.p50 || 0,
        p95ResponseTime: avgResponseTime[0]?.p95 || 0,
        p99ResponseTime: avgResponseTime[0]?.p99 || 0,
      },
      topEndpoints: topEndpoints.map(e => ({ endpoint: e._id, count: e.count })),
      statusDistribution: statusDistribution.map(s => ({
        range: s._id,
        count: s.count,
        percentage: totalRequests > 0 ? (s.count / totalRequests) * 100 : 0,
      })),
      dailyUsage,
      hourlyDistribution,
      errors: errors.map(e => ({
        endpoint: e._id.endpoint,
        statusCode: e._id.statusCode,
        count: e.count,
        lastError: e.lastError,
      })),
    };
  }

  /**
   * Get real-time metrics (last hour)
   */
  async getRealtimeMetrics(developerId: string) {
    const startDate = new Date(Date.now() - 60 * 60 * 1000); // Last hour

    const apiKeys = await this.apiKeyModel.find({ developerId });
    const keyIds = apiKeys.map(k => k._id);

    const requestsLastHour = await this.apiUsageModel.countDocuments({
      developerId: { $in: [developerId, ...keyIds.map(String)] },
      createdAt: { $gte: startDate },
    });

    const avgResponseTime = await this.apiUsageModel.aggregate([
      {
        $match: {
          developerId: { $in: [developerId, ...keyIds.map(String)] },
          createdAt: { $gte: startDate },
        },
      },
      { $group: { _id: null, avg: { $avg: '$responseTime' } } },
    ]);

    // Requests per minute
    const requestsPerMinute = await this.apiUsageModel.aggregate([
      {
        $match: {
          developerId: { $in: [developerId, ...keyIds.map(String)] },
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d %H:%M', date: '$createdAt' } },
          requests: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return {
      requestsLastHour,
      avgResponseTime: avgResponseTime[0]?.avg || 0,
      requestsPerMinute,
    };
  }

  /**
   * Get API key specific analytics
   */
  async getKeyAnalytics(keyId: string, days = 30) {
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const totalRequests = await this.apiUsageModel.countDocuments({
      apiKeyId: keyId,
      createdAt: { $gte: startDate },
    });

    const successRequests = await this.apiUsageModel.countDocuments({
      apiKeyId: keyId,
      statusCode: { $gte: 200, $lt: 400 },
      createdAt: { $gte: startDate },
    });

    const avgResponseTime = await this.apiUsageModel.aggregate([
      { $match: { apiKeyId: keyId, createdAt: { $gte: startDate } } },
      { $group: { _id: null, avg: { $avg: '$responseTime' } } },
    ]);

    const dailyUsage = await this.apiUsageModel.aggregate([
      {
        $match: {
          apiKeyId: keyId,
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          requests: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return {
      totalRequests,
      successRequests,
      successRate: totalRequests > 0 ? (successRequests / totalRequests) * 100 : 0,
      avgResponseTime: avgResponseTime[0]?.avg || 0,
      dailyUsage,
    };
  }

  /**
   * Export analytics data
   */
  async exportAnalytics(developerId: string, days = 30, format = 'json') {
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const data = await this.apiUsageModel.find({
      developerId,
      createdAt: { $gte: startDate },
    }).sort({ createdAt: -1 }).limit(10000);

    if (format === 'csv') {
      const csv = this.convertToCSV(data);
      return { format: 'csv', data: csv };
    }

    return { format: 'json', data };
  }

  private convertToCSV(data: any[]): string {
    if (data.length === 0) return '';

    const headers = ['timestamp', 'endpoint', 'method', 'statusCode', 'responseTime', 'ip'];
    const rows = data.map(d => [
      d.createdAt,
      d.endpoint,
      d.method,
      d.statusCode,
      d.responseTime,
      d.ip,
    ].join(','));

    return [headers.join(','), ...rows].join('\n');
  }
}
