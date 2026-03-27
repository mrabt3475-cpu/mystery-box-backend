import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request, NotFoundException } from '@nestjs/common';
import { DeveloperService } from './developer.service';
import { ApiKeyService, API_PERMISSIONS } from './api-key.service';
import { ApiUsageService } from './api-usage.service';
import { WebhookService } from './webhook.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('developer')
@UseGuards(JwtAuthGuard)
export class DeveloperController {
  constructor(
    private readonly developerService: DeveloperService,
    private readonly apiKeyService: ApiKeyService,
    private readonly apiUsageService: ApiUsageService,
    private readonly webhookService: WebhookService,
  ) {}

  // ============ Developer Account ============
  @Post('register')
  async registerDeveloper(@Request() req, @Body() body: {
    email: string;
    name: string;
    company?: string;
    website?: string;
  }) {
    const developer = await this.developerService.create(req.user.userId, body);
    return {
      id: developer._id,
      email: developer.email,
      name: developer.name,
      company: developer.company,
      status: developer.status,
    };
  }

  @Get('profile')
  async getProfile(@Request() req) {
    const developer = await this.developerService.findByUserId(req.user.userId);
    return developer;
  }

  @Put('profile')
  async updateProfile(@Request() req, @Body() body: any) {
    const developer = await this.developerService.findByUserId(req.user.userId);
    return this.developerService.update(developer._id.toString(), body);
  }

  // ============ API Keys ============
  @Post('keys')
  async createApiKey(@Request() req, @Body() body: {
    name: string;
    permissions?: string[];
    rateLimit?: number;
    expiresAt?: string;
    isTestKey?: boolean;
  }) {
    const developer = await this.developerService.findByUserId(req.user.userId);
    
    const keyData = await this.apiKeyService.create(developer._id.toString(), {
      name: body.name,
      permissions: body.permissions,
      rateLimit: body.rateLimit,
      expiresAt: body.expiresAt ? new Date(body.expiresAt) : undefined,
      isTestKey: body.isTestKey,
    });

    return {
      keyId: keyData.keyId,
      keySecret: keyData.keySecret, // Only shown once!
      keyPrefix: keyData.keyPrefix,
      message: '⚠️ احتفظ بالمفتاح السري - لن تتمكن من رؤيته مرة أخرى!',
    };
  }

  @Get('keys')
  async getApiKeys(@Request() req) {
    const developer = await this.developerService.findByUserId(req.user.userId);
    return this.apiKeyService.getDeveloperKeys(developer._id.toString());
  }

  @Put('keys/:id')
  async updateApiKey(@Request() req, @Param('id') id: string, @Body() body: {
    name?: string;
    permissions?: string[];
    rateLimit?: number;
  }) {
    return this.apiKeyService.updateKey(id, body);
  }

  @Delete('keys/:id')
  async revokeApiKey(@Request() req, @Param('id') id: string) {
    const developer = await this.developerService.findByUserId(req.user.userId);
    await this.apiKeyService.revokeKey(id, developer._id.toString());
    return { message: 'تم إلغاء المفتاح بنجاح' };
  }

  // ============ Usage & Analytics ============
  @Get('usage')
  async getUsage(
    @Request() req,
    @Query('days') days?: string,
    @Query('limit') limit?: string,
  ) {
    const developer = await this.developerService.findByUserId(req.user.userId);
    return this.apiUsageService.getDeveloperUsage(
      developer._id.toString(),
      undefined,
      undefined,
      limit ? parseInt(limit) : 100,
    );
  }

  @Get('usage/stats')
  async getUsageStats(@Request() req, @Query('days') days?: string) {
    const developer = await this.developerService.findByUserId(req.user.userId);
    return this.apiUsageService.getUsageStats(
      developer._id.toString(),
      days ? parseInt(days) : 30,
    );
  }

  @Get('usage/hourly')
  async getHourlyUsage(@Request() req, @Query('hours') hours?: string) {
    const developer = await this.developerService.findByUserId(req.user.userId);
    return this.apiUsageService.getHourlyUsage(
      developer._id.toString(),
      hours ? parseInt(hours) : 24,
    );
  }

  // ============ Webhooks ============
  @Post('webhooks')
  async createWebhook(@Request() req, @Body() body: {
    name: string;
    url: string;
    events: string[];
    headers?: Record<string, string>;
  }) {
    const developer = await this.developerService.findByUserId(req.user.userId);
    return this.webhookService.create(developer._id.toString(), body);
  }

  @Get('webhooks')
  async getWebhooks(@Request() req) {
    const developer = await this.developerService.findByUserId(req.user.userId);
    return this.webhookService.getDeveloperWebhooks(developer._id.toString());
  }

  @Put('webhooks/:id')
  async updateWebhook(
    @Request() req,
    @Param('id') id: string,
    @Body() body: {
      name?: string;
      url?: string;
      events?: string[];
      isActive?: boolean;
    },
  ) {
    const developer = await this.developerService.findByUserId(req.user.userId);
    return this.webhookService.update(id, developer._id.toString(), body);
  }

  @Delete('webhooks/:id')
  async deleteWebhook(@Request() req, @Param('id') id: string) {
    const developer = await this.developerService.findByUserId(req.user.userId);
    await this.webhookService.delete(id, developer._id.toString());
    return { message: 'تم حذف الـ Webhook بنجاح' };
  }

  @Post('webhooks/:id/regenerate-secret')
  async regenerateSecret(@Request() req, @Param('id') id: string) {
    const developer = await this.developerService.findByUserId(req.user.userId);
    const newSecret = await this.webhookService.regenerateSecret(id, developer._id.toString());
    return {
      secret: newSecret,
      message: '⚠️ تم توليد سر جديد - قم بتحديثه في تطبيقك!',
    };
  }

  // ============ Permissions List ============
  @Get('permissions')
  async getPermissions() {
    return API_PERMISSIONS;
  }
}
