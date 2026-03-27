import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ApiKeyDocument = ApiKey & Document;

@Schema({ timestamps: true })
export class ApiKey {
  @Prop({ required: true })
  developerId: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  keyId: string;

  @Prop({ required: true })
  keyHash: string;

  @Prop()
  keyPrefix: string;

  @Prop()
  keySecret: string;

  @Prop({ type: [String], default: ['read:products', 'read:boxes'] })
  permissions: string[];

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  lastUsedAt: Date;

  @Prop({ default: 0 })
  requestsCount: number;

  @Prop({ default: 1000 })
  rateLimit: number;

  @Prop({ default: 'hour' })
  rateLimitUnit: string;

  @Prop()
  expiresAt: Date;

  @Prop()
  revokedAt: Date;

  @Prop({ type: Object })
  metadata: Record<string, any>;

  @Prop({ default: false })
  isTestKey: boolean;
}

export const ApiKeySchema = SchemaFactory.createForClass(ApiKey);
ApiKeySchema.index({ developerId: 1 });
ApiKeySchema.index({ keyId: 1 }, { unique: true });
