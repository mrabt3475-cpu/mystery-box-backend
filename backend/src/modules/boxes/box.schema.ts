import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum BoxStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  PAUSED = 'paused',
  ARCHIVED = 'archived',
}

export enum BoxType {
  STANDARD = 'standard',     // صندوق عادي
  GUARANTEED = 'guaranteed', // مضمون (يحتوي على جائزة معينة)
  LOOTBOX = 'lootbox',       // صندوق كنز
  EVENT = 'event',           // صندوق حدث
}

@Schema({ timestamps: true })
export class Box extends Document {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ type: String, enum: BoxType, default: BoxType.STANDARD })
  type: BoxType;

  @Prop({ type: String, enum: BoxStatus, default: BoxStatus.DRAFT })
  status: BoxStatus;

  @Prop({ required: true })
  cost: number; // التكلفة بالنقاط

  @Prop({ default: 0 })
  discount: number; // نسبة الخصم (0-100)

  @Prop()
  imageUrl: string;

  @Prop()
  iconUrl: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Prize' }] })
  prizes: Types.ObjectId[];

  @Prop({ type: Object })
  prizeConfig: {
    totalWeight: number;
    guaranteedPrize?: Types.ObjectId;
    minGuaranteedWin?: number;
  };

  @Prop({ type: Object })
  settings: {
    dailyLimit: number;
    totalLimit: number;
    cooldownMinutes: number;
    minLevel: number;
    requireEmailVerification: boolean;
  };

  @Prop({ type: Object })
  fairness: {
    serverSeed: string;
    clientSeed: string;
    nonce: number;
    lastVerified: Date;
  };

  @Prop({ type: Object })
  statistics: {
    totalOpens: number;
    totalWins: number;
    totalValue: number;
    averagePayout: number;
  };

  @Prop({ default: 0 })
  sortOrder: number;

  @Prop({ type: [String], default: ['ar', 'en'] })
  availableLocales: string[];

  @Prop({ type: Object })
  translations: Record<string, {
    name: string;
    description: string;
  }>;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy: Types.ObjectId;

  @Prop()
  startsAt: Date;

  @Prop()
  endsAt: Date;
}

export const BoxSchema = SchemaFactory.createForClass(Box);

// Indexes
BoxSchema.index({ status: 1, sortOrder: 1 });
BoxSchema.index({ type: 1 });
BoxSchema.index({ createdAt: -1 });
