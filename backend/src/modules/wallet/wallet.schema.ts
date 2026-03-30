import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type WalletDocument = Wallet & Document;

@Schema({ timestamps: true })
export class Wallet {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true })
  userId: Types.ObjectId;

  @Prop({ default: 0 })
  balance: number;

  @Prop({ default: 0 })
  points: number;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Transaction' }], default: [] })
  transactions: Types.ObjectId[];

  @Prop({ default: 0 })
  totalDeposited: number;

  @Prop({ default: 0 })
  totalWithdrawn: number;

  @Prop({ default: true })
  isActive: boolean;
}

export const WalletSchema = SchemaFactory.createForClass(Wallet);

WalletSchema.index({ userId: 1 });
WalletSchema.index({ createdAt: -1 });
