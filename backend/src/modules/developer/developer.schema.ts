import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DeveloperDocument = Developer & Document;

@Schema({ timestamps: true })
export class Developer {
  @Prop({ required: true, unique: true })
  userId: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  company: string;

  @Prop()
  website: string;

  @Prop({ default: 'active' })
  status: string;

  @Prop({ type: [String], default: [] })
  apiKeys: string[];

  @Prop({ default: 0 })
  totalRequests: number;

  @Prop({ default: 0 })
  monthlyRequests: number;

  @Prop()
  lastRequestAt: Date;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({ default: 'free' })
  plan: string;

  @Prop({ type: Object })
  settings: Record<string, any>;
}

export const DeveloperSchema = SchemaFactory.createForClass(Developer);
