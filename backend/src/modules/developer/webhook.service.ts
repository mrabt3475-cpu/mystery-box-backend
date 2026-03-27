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

    // Validate URL if provided
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

  async trigger(event: string, payload: any): Promise<void> {
    // Find all webhooks subscribed to this event
    const webhooks = await this.webhookModel.find({
      events: event,
      isActive: true,
    });

    for (const webhook of webhooks) {
      this.sendWebhook(webhook, event, payload);
    }
  }

  private async sendWebhook(webhook: WebhookDocument, event: string, payload: any): Promise<void> {
    const startTime = Date.now();
    let success = false;
    let statusCode = 0;
    let responseBody = '';
    let errorMessage = '';

    try {
      const signature = this.generateSignature(webhook.secret, JSON.stringify(payload));

      const response = await axios.post(webhook.url, payload, {
        headers: {
          'Content-Type': 'application/json',
          'X-Webhook-Signature': signature,
          'X-Webhook-Event': event,
          ...webhook.headers,
        },
        timeout: webhook.timeout * 1000,
      });

      statusCode = response.status;
      responseBody = JSON.stringify(response.data);
      success = statusCode >= 200 && statusCode < 300;

      await this.webhookModel.findByIdAndUpdate(webhook._id, {
        lastTriggeredAt: new Date(),
        $inc: { successCount: success ? 1 : 0, failureCount: success ? 0 : 1 },
      });
    } catch (error: any) {
      statusCode = error.response?.status || 0;
      errorMessage = error.message;
      success = false;

      await this.webhookModel.findByIdAndUpdate(webhook._id, {
        lastFailedAt: new Date(),
        $inc: { failureCount: 1 },
      });
    }

    // Log the webhook call
    await this.webhookLogService.log({
      webhookId: webhook._id.toString(),
      developerId: webhook.developerId,
      event,
      payload: JSON.stringify(payload),
      url: webhook.url,
      statusCode,
      success,
      responseBody,
      errorMessage,
      responseTime: Date.now() - startTime,
    });
  }

  private generateSignature(secret: string, payload: string): string {
    return crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');
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
}
