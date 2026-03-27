import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type WebhookLogDocument = WebhookLog & Document;

@Schema({ timestamps: true, expireAfterSeconds: 30 * 24 * 60 * 60 }) // 30 days
@Schema({ timestamps: true })
export class WebhookLog {
  @Prop({ required: true })
  webhookId: string;

  @Prop({ required: true })
  developerId: string;

  @Prop({ required: true })
  event: string;

  @Prop({ required: true })
  payload: string;

  @Prop({ required: true })
  url: string;

  @Prop({ required: true })
  statusCode: number;

  @Prop({ default: false })
  success: boolean;

  @Prop()
  responseBody: string;

  @Prop()
  errorMessage: string;

  @Prop({ default: 0 })
  attempts: number;

  @Prop()
  responseTime: number;
}

export const WebhookLogSchema = SchemaFactory.createForClass(WebhookLog);
WebhookLogSchema.index({ webhookId: 1, createdAt: -1 });
WebhookLogSchema.index({ developerId: 1, createdAt: -1 });
