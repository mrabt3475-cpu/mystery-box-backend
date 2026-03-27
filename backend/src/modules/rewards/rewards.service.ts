import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Prize, PrizeType, PrizeRarity, PrizeStatus } from './prize.schema';

@Injectable()
export class RewardsService {
  constructor(
    @InjectModel(Prize.name) private prizeModel: Model<Prize>,
  ) {}

  /**
   * منح مكافأة للمستخدم
   */
  async grantReward(userId: string, prizeId: string): Promise<Prize> {
    const prize = await this.prizeModel.findById(prizeId);
    
    if (!prize || !prize.isActive) {
      throw new NotFoundException('الجائزة غير موجودة أو غير نشطة');
    }

    // التحقق من الحدود
    if (prize.limits?.totalQuantity) {
      const used = prize.statistics?.totalWon || 0;
      if (used >= prize.limits.totalQuantity) {
        throw new BadRequestException('الجائزة انتهت');
      }
    }

    // تحديث الإحصائيات
    await this.prizeModel.findByIdAndUpdate(prizeId, {
      $inc: {
        'statistics.totalWon': 1,
        'statistics.totalValue': prize.value || 0,
      },
      'statistics.lastWonAt': new Date(),
    });

    return prize;
  }

  /**
   * الحصول على الجوائز حسب الصندوق
   */
  async getPrizesByBox(boxId: string): Promise<Prize[]> {
    return this.prizeModel.find({
      _id: { $in: boxId },
      isActive: true,
      status: PrizeStatus.ACTIVE,
    });
  }

  /**
   * إنشاء جائزة جديدة
   */
  async createPrize(data: Partial<Prize>, userId: string): Promise<Prize> {
    const prize = new this.prizeModel({
      ...data,
      createdBy: new Types.ObjectId(userId),
      statistics: {
        totalWon: 0,
        totalValue: 0,
      },
    });

    return prize.save();
  }

  /**
   * الحصول على الجوائز النادرة
   */
  async getRarityPrizes(rarity: PrizeRarity): Promise<Prize[]> {
    return this.prizeModel.find({
      rarity,
      isActive: true,
      status: PrizeStatus.ACTIVE,
    });
  }

  /**
   * إحصائيات الجوائز
   */
  async getPrizeStats(prizeId: string): Promise<any> {
    const prize = await this.prizeModel.findById(prizeId);
    if (!prize) {
      throw new NotFoundException('الجائزة غير موجودة');
    }

    return {
      totalWon: prize.statistics?.totalWon || 0,
      totalValue: prize.statistics?.totalValue || 0,
      remaining: prize.limits?.totalQuantity 
        ? prize.limits.totalQuantity - (prize.statistics?.totalWon || 0)
        : 'unlimited',
    };
  }
}
