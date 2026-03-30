import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TransactionDocument = Transaction & Document;

@Schema({ timestamps: true })
export class Transaction {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true, enum: ['credit', 'debit'] })
  direction: string;

  @Prop({ default: 'USD' })
  currency: string;

  @Prop({ default: 'completed' })
  status: string;

  @Prop()
  description: string;

  @Prop()
  referenceId: string;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);

TransactionSchema.index({ userId: 1, createdAt: -1 });
TransactionSchema.index({ status: 1 });
