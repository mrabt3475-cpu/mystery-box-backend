import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type NotificationDocument = Notification & Document;

export enum NotificationType {
  BOX_OPENED = 'box_opened',
  PRIZE_WON = 'prize_won',
  DAILY_REWARD = 'daily_reward',
  REFERRAL_BONUS = 'referral_bonus',
  VIP_EXPIRED = 'vip_expired',
  PAYMENT_SUCCESS = 'payment_success',
  PAYMENT_FAILED = 'payment_failed',
  SYSTEM = 'system',
}

export enum NotificationStatus {
  UNREAD = 'unread',
  READ = 'read',
  ARCHIVED = 'archived',
}

@Schema({ timestamps: true })
export class Notification {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId: Types.ObjectId;

  @Prop({ required: true, enum: NotificationType })
  type: NotificationType;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  message: string;

  @Prop({ type: Object, default: {} })
  data: Record<string, any>;

  @Prop({ default: false })
  isRead: boolean;

  @Prop({ default: false })
  isPushed: boolean;

  @Prop({ enum: NotificationStatus, default: NotificationStatus.UNREAD })
  status: NotificationStatus;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);

NotificationSchema.index({ userId: 1, createdAt: -1 });
NotificationSchema.index({ userId: 1, isRead: 1 });
