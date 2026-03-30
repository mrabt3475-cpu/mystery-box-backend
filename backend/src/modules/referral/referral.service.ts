import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Referral, ReferralDocument } from './referral.schema';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ReferralService {
  constructor(
    @InjectModel(Referral.name) private referralModel: Model<ReferralDocument>,
    private configService: ConfigService,
  ) {}

  async generateReferralCode(userId: string): Promise<string> {
    const code = `REF${userId.slice(-6).toUpperCase()}${Date.now().toString(36).toUpperCase()}`;
    return code;
  }

  async createReferral(referrerId: string, refereeId: string): Promise<ReferralDocument> {
    const existingReferral = await this.referralModel.findOne({ refereeId });
    if (existingReferral) {
      throw new BadRequestException('User already referred');
    }

    const referralCode = await this.generateReferralCode(referrerId);
    const commissionRate = this.configService.get<number>('REFERRAL_COMMISSION') || 0.10;
    const refereeBonus = this.configService.get<number>('POINTS_RATIO') || 0.05;

    const referral = await this.referralModel.create({
      referrerId: new Types.ObjectId(referrerId),
      refereeId: new Types.ObjectId(refereeId),
      referralCode,
      referrerBonus: commissionRate * 100,
      refereeBonus: refereeBonus * 100,
    });

    return referral;
  }

  async claimBonus(referrerId: string): Promise<void> {
    const referral = await this.referralModel.findOne({ 
      referrerId: new Types.ObjectId(referrerId),
      isBonusClaimed: false 
    });

    if (!referral) {
      throw new BadRequestException('No pending referral bonus');
    }

    referral.isBonusClaimed = true;
    referral.bonusClaimedAt = new Date();
    await referral.save();
  }

  async getReferralStats(userId: string): Promise<{ total: number; successful: number; pending: number }> {
    const total = await this.referralModel.countDocuments({ referrerId: new Types.ObjectId(userId) });
    const successful = await this.referralModel.countDocuments({ 
      referrerId: new Types.ObjectId(userId),
      isBonusClaimed: true 
    });
    const pending = total - successful;

    return { total, successful, pending };
  }

  async getReferrals(userId: string): Promise<ReferralDocument[]> {
    return this.referralModel
      .find({ referrerId: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findByCode(code: string): Promise<ReferralDocument | null> {
    return this.referralModel.findOne({ referralCode: code }).exec();
  }
}
