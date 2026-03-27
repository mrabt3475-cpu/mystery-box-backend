import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: 0 })
  points: number;

  @Prop({ default: 0 })
  balance: number;

  @Prop({ default: 1 })
  level: number;

  @Prop({ default: 0 })
  boxesOpened: number;

  @Prop({ default: 0 })
  totalWins: number;

  @Prop({ default: 0 })
  totalPointsEarned: number;

  @Prop({ default: 0 })
  dailyStreak: number;

  @Prop()
  lastDailyReward: Date;

  @Prop({ type: [String], default: [] })
  achievements: string[];

  @Prop({ type: Array, default: [] })
  inventory: any[];

  @Prop()
  referralCode: string;

  @Prop()
  referredBy: string;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({ default: false })
  isBanned: boolean;

  @Prop()
  lastLoginAt: Date;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
