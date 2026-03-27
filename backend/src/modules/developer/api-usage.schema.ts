import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ApiUsageDocument = ApiUsage & Document;

@Schema({ timestamps: true, expireAfterSeconds: 90 * 24 * 60 * 60 }) // 90 days
@Schema({ timestamps: true })
export class ApiUsage {
  @Prop({ required: true })
  apiKeyId: string;

  @Prop({ required: true })
  developerId: string;

  @Prop({ required: true })
  endpoint: string;

  @Prop({ required: true })
  method: string;

  @Prop({ required: true })
  statusCode: number;

  @Prop({ default: 0 })
  responseTime: number;

  @Prop()
  ip: string;

  @Prop()
  userAgent: string;

  @Prop({ type: Object })
  requestBody: Record<string, any>;

  @Prop({ type: Object })
  responseBody: Record<string, any>;

  @Prop({ default: false })
  isError: boolean;

  @Prop()
  errorMessage: string;
}

export const ApiUsageSchema = SchemaFactory.createForClass(ApiUsage);
ApiUsageSchema.index({ developerId: 1, createdAt: -1 });
ApiUsageSchema.index({ apiKeyId: 1, createdAt: -1 });
ApiUsageSchema.index({ endpoint: 1, createdAt: -1 });
