import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TransactionDocument = Transaction & Document;

export enum TransactionType {
  PURCHASE = 'purchase',
  OPEN_BOX = 'open_box',
  DAILY_REWARD = 'daily_reward',
  REFERRAL = 'referral',
  WIN = 'win',
  WITHDRAWAL = 'withdrawal',
  BONUS = 'bonus',
}

@Schema({ timestamps: true })
export class Transaction {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true, enum: TransactionType })
  type: TransactionType;

  @Prop({ required: true })
  balanceAfter: number;

  @Prop({ type: Object })
  metadata: Record<string, any>;

  @Prop({ default: 'completed' })
  status: string;

  @Prop()
  createdAt: Date;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
