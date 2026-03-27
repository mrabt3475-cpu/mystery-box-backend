import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AbuseLogDocument = AbuseLog & Document;

@Schema({ timestamps: true })
export class AbuseLog {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  ip: string;

  @Prop({ required: true })
  action: string;

  @Prop()
  details: string;

  @Prop({ default: false })
  isBot: boolean;

  @Prop()
  userAgent: string;

  @Prop()
  createdAt: Date;
}

export const AbuseLogSchema = SchemaFactory.createForClass(AbuseLog);
