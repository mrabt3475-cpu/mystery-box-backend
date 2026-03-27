import { Controller, Get, Post, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { WebhookEventService, WEBHOOK_EVENTS } from './webhook-event.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('webhooks')
export class WebhooksController {
  constructor(
    private readonly webhookService: WebhookService,
    private readonly webhookEventService: WebhookEventService,
  ) {}

  // ============ Available Events ============
  @Get('events')
  getEvents() {
    return this.webhookEventService.getAvailableEvents();
  }

  // ============ Create Webhook ============
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Request() req,
    @Body() body: {
      name: string;
      url: string;
      events: string[];
      headers?: Record<string, string>;
      maxRetries?: number;
      timeout?: number;
    },
  ) {
    return this.webhookService.create(req.user.developerId, body);
  }

  // ============ List Webhooks ============
  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Request() req) {
    return this.webhookService.getDeveloperWebhooks(req.user.developerId);
  }

  // ============ Get Single Webhook ============
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Request() req, @Param('id') id: string) {
    return this.webhookService.findById(id);
  }

  // ============ Update Webhook ============
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Request() req,
    @Param('id') id: string,
    @Body() body: {
      name?: string;
      url?: string;
      events?: string[];
      isActive?: boolean;
      headers?: Record<string, string>;
    },
  ) {
    return this.webhookService.update(id, req.user.developerId, body);
  }

  // ============ Delete Webhook ============
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Request() req, @Param('id') id: string) {
    await this.webhookService.delete(id, req.user.developerId);
    return { message: 'تم حذف الـ Webhook بنجاح' };
  }

  // ============ Regenerate Secret ============
  @UseGuards(JwtAuthGuard)
  @Post(':id/regenerate-secret')
  async regenerateSecret(@Request() req, @Param('id') id: string) {
    const newSecret = await this.webhookService.regenerateSecret(id, req.user.developerId);
    return {
      secret: newSecret,
      message: '⚠️ تم توليد سر جديد - قم بتحديثه في تطبيقك!',
    };
  }

  // ============ Test Webhook ============
  @UseGuards(JwtAuthGuard)
  @Post(':id/test')
  async test(@Param('id') id: string) {
    return this.webhookEventService.testWebhook(id);
  }

  // ============ Get Webhook Logs ============
  @UseGuards(JwtAuthGuard)
  @Get(':id/logs')
  async getLogs(
    @Request() req,
    @Param('id') id: string,
    @Query('limit') limit?: string,
  ) {
    return this.webhookService.getLogs(id, limit ? parseInt(limit) : 20);
  }

  // ============ Get Webhook Stats ============
  @UseGuards(JwtAuthGuard)
  @Get(':id/stats')
  async getStats(
    @Param('id') id: string,
    @Query('days') days?: string,
  ) {
    return this.webhookService.getStats(id, days ? parseInt(days) : 7);
  }
}
