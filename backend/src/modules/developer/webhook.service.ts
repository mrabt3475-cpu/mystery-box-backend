import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Webhook, WebhookDocument } from './webhook.schema';
import { WebhookLogService } from './webhook-log.service';
import * as crypto from 'crypto';
import axios from 'axios';

@Injectable()
export class WebhookService {
  constructor(
    @InjectModel(Webhook.name) private webhookModel: Model<WebhookDocument>,
    private readonly webhookLogService: WebhookLogService,
  ) {}

  private generateSecret(): string {
    return `whsec_${crypto.randomBytes(32).toString('hex')}`;
  }

  async create(developerId: string, data: {
    name: string;
    url: string;
    events: string[];
    headers?: Record<string, string>;
    maxRetries?: number;
    timeout?: number;
  }): Promise<Webhook> {
    // Validate URL
    try {
      new URL(data.url);
    } catch {
      throw new BadRequestException('رابط غير صالح');
    }

    const webhook = new this.webhookModel({
      developerId,
      name: data.name,
      url: data.url,
      events: data.events,
      secret: this.generateSecret(),
      headers: data.headers || {},
      maxRetries: data.maxRetries || 3,
      timeout: data.timeout || 30,
      isActive: true,
    });

    return webhook.save();
  }

  async findById(id: string): Promise<Webhook> {
    const webhook = await this.webhookModel.findById(id);
    if (!webhook) {
      throw new NotFoundException('Webhook غير موجود');
    }
    return webhook;
  }

  async getDeveloperWebhooks(developerId: string): Promise<Webhook[]> {
    return this.webhookModel.find({ developerId }).sort({ createdAt: -1 }).exec();
  }

  async update(id: string, developerId: string, data: {
    name?: string;
    url?: string;
    events?: string[];
    isActive?: boolean;
    headers?: Record<string, string>;
  }): Promise<Webhook> {
    const webhook = await this.webhookModel.findOne({ _id: id, developerId });
    if (!webhook) {
      throw new NotFoundException('Webhook غير موجود');
    }

    if (data.url) {
      try {
        new URL(data.url);
      } catch {
        throw new BadRequestException('رابط غير صالح');
      }
    }

    const updated = await this.webhookModel
      .findByIdAndUpdate(id, data, { new: true })
      .exec();

    return updated!;
  }

  async delete(id: string, developerId: string): Promise<void> {
    const webhook = await this.webhookModel.findOne({ _id: id, developerId });
    if (!webhook) {
      throw new NotFoundException('Webhook غير موجود');
    }

    await this.webhookModel.findByIdAndDelete(id);
  }

  async regenerateSecret(id: string, developerId: string): Promise<string> {
    const webhook = await this.webhookModel.findOne({ _id: id, developerId });
    if (!webhook) {
      throw new NotFoundException('Webhook غير موجود');
    }

    const newSecret = this.generateSecret();
    await this.webhookModel.findByIdAndUpdate(id, { secret: newSecret });

    return newSecret;
  }

  async getLogs(webhookId: string, limit = 20) {
    return this.webhookLogService.getWebhookLogs(webhookId, limit);
  }

  async getStats(webhookId: string, days = 7) {
    return this.webhookLogService.getWebhookStats(webhookId, days);
  }
}
