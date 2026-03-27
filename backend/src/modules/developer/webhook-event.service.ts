import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Webhook, WebhookDocument } from './webhook.schema';
import { WebhookLog, WebhookLogDocument } from './webhook-log.schema';
import * as crypto from 'crypto';
import axios from 'axios';

// Available webhook events
export const WEBHOOK_EVENTS = {
  'user.registered': 'تسجيل مستخدم جديد',
  'user.login': 'تسجيل دخول',
  'box.opened': 'فتح صندوق',
  'box.won': 'فوز بجائزة',
  'box.lost': 'خسارة في الصندوق',
  'order.created': 'إنشاء طلب',
  'order.shipped': 'شحن الطلب',
  'order.delivered': 'تسليم الطلب',
  'order.cancelled': 'إلغاء الطلب',
  'reward.claimed': 'استلام مكافأة',
  'reward.created': 'مكافأة جديدة',
  'points.earned': 'اكتساب نقاط',
  'points.deducted': 'خصم نقاط',
  'daily.bonus': 'مكافأة يومية',
  'referral.bonus': 'مكافأة إحالة',
};

@Injectable()
export class WebhookEventService implements OnModuleInit {
  constructor(
    @InjectModel(Webhook.name) private webhookModel: Model<WebhookDocument>,
    @InjectModel(WebhookLog.name) private webhookLogModel: Model<WebhookLogDocument>,
  ) {}

  onModuleInit() {
    console.log('🔔 Webhook Event Service initialized');
  }

  /**
   * Trigger a webhook event for all subscribed developers
   */
  async trigger(event: string, payload: any): Promise<void> {
    console.log(`🔔 Triggering webhook event: ${event}`);
    
    // Find all active webhooks subscribed to this event
    const webhooks = await this.webhookModel.find({
      events: event,
      isActive: true,
    });

    if (webhooks.length === 0) {
      console.log(`📭 No webhooks subscribed to event: ${event}`);
      return;
    }

    console.log(`📨 Sending to ${webhooks.length} webhooks`);

    // Send to each webhook in parallel
    const promises = webhooks.map((webhook) => 
      this.sendWebhook(webhook, event, payload)
    );

    await Promise.allSettled(promises);
  }

  /**
   * Send webhook with retry logic
   */
  private async sendWebhook(
    webhook: WebhookDocument,
    event: string,
    payload: any,
  ): Promise<void> {
    const startTime = Date.now();
    const payloadString = JSON.stringify(payload);
    const signature = this.generateSignature(webhook.secret, payloadString);

    let lastError: string = '';
    let statusCode: number = 0;
    let success: boolean = false;

    // Try up to maxRetries times
    for (let attempt = 1; attempt <= webhook.maxRetries; attempt++) {
      try {
        const response = await axios.post(
          webhook.url,
          {
            event,
            timestamp: new Date().toISOString(),
            data: payload,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'X-Webhook-Signature': signature,
              'X-Webhook-Event': event,
              'X-Webhook-Attempt': attempt.toString(),
              ...webhook.headers,
            },
            timeout: webhook.timeout * 1000,
          }
        );

        statusCode = response.status;
        success = statusCode >= 200 && statusCode < 300;
        
        if (success) {
          await this.webhookModel.findByIdAndUpdate(webhook._id, {
            lastTriggeredAt: new Date(),
            $inc: { successCount: 1 },
          });
          break; // Success, exit retry loop
        }
      } catch (error: any) {
        statusCode = error.response?.status || 0;
        lastError = error.message;
        
        // Update failure count
        await this.webhookModel.findByIdAndUpdate(webhook._id, {
          lastFailedAt: new Date(),
          $inc: { failureCount: 1 },
        });

        // Wait before retry
        if (attempt < webhook.maxRetries) {
          await this.delay(1000 * attempt); // Exponential backoff
        }
      }
    }

    // Log the webhook call
    await this.logWebhookCall({
      webhookId: webhook._id.toString(),
      developerId: webhook.developerId,
      event,
      payload: payloadString,
      url: webhook.url,
      statusCode,
      success,
      responseBody: '',
      errorMessage: lastError,
      attempts: webhook.maxRetries,
      responseTime: Date.now() - startTime,
    });
  }

  /**
   * Generate HMAC signature for webhook payload
   */
  private generateSignature(secret: string, payload: string): string {
    return crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');
  }

  /**
   * Log webhook call to database
   */
  private async logWebhookCall(data: {
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
  }): Promise<void> {
    try {
      const log = new this.webhookLogModel(data);
      await log.save();
    } catch (error) {
      console.error('Failed to log webhook call:', error);
    }
  }

  /**
   * Delay helper for retry logic
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Get available events list
   */
  getAvailableEvents(): Record<string, string> {
    return WEBHOOK_EVENTS;
  }

  /**
   * Test webhook endpoint
   */
  async testWebhook(webhookId: string): Promise<{
    success: boolean;
    statusCode: number;
    responseTime: number;
    error?: string;
  }> {
    const webhook = await this.webhookModel.findById(webhookId);
    if (!webhook) {
      return { success: false, statusCode: 0, responseTime: 0, error: 'Webhook not found' };
    }

    const startTime = Date.now();
    const testPayload = { test: true, timestamp: new Date().toISOString() };
    const signature = this.generateSignature(webhook.secret, JSON.stringify(testPayload));

    try {
      await axios.post(
        webhook.url,
        { event: 'test', data: testPayload },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-Webhook-Signature': signature,
            'X-Webhook-Event': 'test',
          },
          timeout: webhook.timeout * 1000,
        }
      );

      return {
        success: true,
        statusCode: 200,
        responseTime: Date.now() - startTime,
      };
    } catch (error: any) {
      return {
        success: false,
        statusCode: error.response?.status || 0,
        responseTime: Date.now() - startTime,
        error: error.message,
      };
    }
  }
}
