import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ReferralDocument = Referral & Document;

@Schema({ timestamps: true })
export class Referral {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  referrerId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  refereeId: Types.ObjectId;

  @Prop({ required: true })
  referralCode: string;

  @Prop({ default: false })
  isBonusClaimed: boolean;

  @Prop()
  bonusClaimedAt: Date;

  @Prop({ default: 0 })
  referrerBonus: number;

  @Prop({ default: 0 })
  refereeBonus: number;
}

export const ReferralSchema = SchemaFactory.createForClass(Referral);

ReferralSchema.index({ referrerId: 1 });
ReferralSchema.index({ refereeId: 1 }, { unique: true });
ReferralSchema.index({ referralCode: 1 });
