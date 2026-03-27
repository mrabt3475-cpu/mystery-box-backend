import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type WebhookDocument = Webhook & Document;

@Schema({ timestamps: true })
export class Webhook {
  @Prop({ required: true })
  developerId: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  url: string;

  @Prop({ type: [String], default: [] })
  events: string[];

  @Prop({ required: true })
  secret: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: 0 })
  successCount: number;

  @Prop({ default: 0 })
  failureCount: number;

  @Prop()
  lastTriggeredAt: Date;

  @Prop()
  lastFailedAt: Date;

  @Prop({ default: 3 })
  maxRetries: number;

  @Prop({ default: 30 })
  timeout: number;

  @Prop({ type: Object })
  headers: Record<string, string>;
}

export const WebhookSchema = SchemaFactory.createForClass(Webhook);
WebhookSchema.index({ developerId: 1 });
