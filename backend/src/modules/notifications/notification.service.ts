import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Notification, NotificationDocument, NotificationType } from './notification.schema';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name) private notificationModel: Model<NotificationDocument>,
  ) {}

  async create(
    userId: string,
    type: NotificationType,
    title: string,
    message: string,
    data: Record<string, any> = {},
  ): Promise<NotificationDocument> {
    return this.notificationModel.create({
      userId: new Types.ObjectId(userId),
      type,
      title,
      message,
      data,
    });
  }

  async createBoxOpened(userId: string, boxName: string, prizeName: string): Promise<NotificationDocument> {
    return this.create(
      userId,
      NotificationType.BOX_OPENED,
      '📦 تم فتح الصندوق',
      `لقد فتحت ${boxName} وفزت بـ ${prizeName}!`,
      { boxName, prizeName },
    );
  }

  async createPrizeWon(userId: string, prizeName: string, prizeValue: number): Promise<NotificationDocument> {
    return this.create(
      userId,
      NotificationType.PRIZE_WON,
      '🎉 تهانينا!',
      `لقد فزت بـ ${prizeName} بقيمة ${prizeValue}$!`,
      { prizeName, prizeValue },
    );
  }

  async createDailyReward(userId: string, points: number): Promise<NotificationDocument> {
    return this.create(
      userId,
      NotificationType.DAILY_REWARD,
      '🎁 مكافأة يومية',
      `لقد حصلت على ${points} نقطة كمكافأة يومية!`,
      { points },
    );
  }

  async createReferralBonus(userId: string, refereeName: string, bonusPoints: number): Promise<NotificationDocument> {
    return this.create(
      userId,
      NotificationType.REFERRAL_BONUS,
      '👥 صديق جديد',
      `لقد سجل ${refereeName} باستخدام رابطك الإحالي! حصلت على ${bonusPoints} نقاط.`,
      { refereeName, bonusPoints },
    );
  }

  async getUserNotifications(userId: string, limit: number = 20, skip: number = 0): Promise<NotificationDocument[]> {
    return this.notificationModel
      .find({ userId: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
  }

  async getUnreadCount(userId: string): Promise<number> {
    return this.notificationModel.countDocuments({
      userId: new Types.ObjectId(userId),
      isRead: false,
    });
  }

  async markAsRead(notificationId: string): Promise<void> {
    await this.notificationModel.findByIdAndUpdate(notificationId, {
      isRead: true,
      status: 'read',
    });
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.notificationModel.updateMany(
      { userId: new Types.ObjectId(userId), isRead: false },
      { isRead: true, status: 'read' },
    );
  }

  async deleteNotification(notificationId: string): Promise<void> {
    await this.notificationModel.findByIdAndDelete(notificationId);
  }
}
