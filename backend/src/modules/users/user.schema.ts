import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  telegramId: string;

  @Prop({ required: true })
  username: string;

  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  avatar: string;

  @Prop({ default: 0 })
  balance: number;

  @Prop({ default: 0 })
  points: number;

  @Prop({ default: 0 })
  totalWins: number;

  @Prop({ default: 0 })
  totalSpent: number;

  @Prop({ default: 1 })
  level: number;

  @Prop({ type: Object, default: () => ({
    name: 'أنمي نيون',
    animation: 'float',
    soundEnabled: true,
    hapticsEnabled: true,
    particlesEnabled: true
  }) })
  themeSettings: {
    name: string;
    animation: string;
    soundEnabled: boolean;
    hapticsEnabled: boolean;
    particlesEnabled: boolean;
  };

  @Prop({ type: [Types.ObjectId], ref: 'Box', default: [] })
  ownedBoxes: Types.ObjectId[];

  @Prop({ type: [Types.ObjectId], ref: 'Prize', default: [] })
  prizes: Types.ObjectId[];

  @Prop({ type: [Types.ObjectId], ref: 'Transaction', default: [] })
  transactions: Types.ObjectId[];

  @Prop({ type: Types.ObjectId, ref: 'User', default: null })
  referredBy: Types.ObjectId;

  @Prop({ default: false })
  isVip: boolean;

  @Prop()
  vipExpiresAt: Date;

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  lastActiveAt: Date;

  @Prop({ type: Object })
  settings: {
    language: string;
    notifications: boolean;
    twoFactorEnabled: boolean;
  };

  @Prop({ type: Object })
  stats: {
    boxesOpened: number;
    totalPrizeValue: number;
    biggestWin: number;
    referralEarnings: number;
  };
}

export const UserSchema = SchemaFactory.createForClass(User);
