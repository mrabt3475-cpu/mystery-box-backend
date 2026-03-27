import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RewardDocument = Reward & Document;

@Schema({ timestamps: true })
export class Reward {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  value: number;

  @Prop()
  image: string;

  @Prop({ default: false })
  isClaimed: boolean;

  @Prop()
  claimedAt: Date;

  @Prop()
  createdAt: Date;
}

export const RewardSchema = SchemaFactory.createForClass(Reward);
