import { Controller, Get, Post, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('analytics')
@UseGuards(JwtAuthGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  // ============ Developer Analytics ============
  @Get('overview')
  async getOverview(
    @Request() req,
    @Query('days') days?: string,
  ) {
    return this.analyticsService.getDeveloperAnalytics(
      req.user.userId,
      days ? parseInt(days) : 30,
    );
  }

  @Get('realtime')
  async getRealtime(@Request() req) {
    return this.analyticsService.getRealtimeMetrics(req.user.userId);
  }

  @Get('key/:keyId')
  async getKeyAnalytics(
    @Param('keyId') keyId: string,
    @Query('days') days?: string,
  ) {
    return this.analyticsService.getKeyAnalytics(
      keyId,
      days ? parseInt(days) : 30,
    );
  }

  @Get('export')
  async exportAnalytics(
    @Request() req,
    @Query('days') days?: string,
    @Query('format') format?: string,
  ) {
    return this.analyticsService.exportAnalytics(
      req.user.userId,
      days ? parseInt(days) : 30,
      format || 'json',
    );
  }
}
