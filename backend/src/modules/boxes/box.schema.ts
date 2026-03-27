import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type BoxDocument = Box & Document;

@Schema()
export class Box {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  winChance: number;

  @Prop({ type: Array, default: [] })
  prizes: any[];

  @Prop()
  image: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const BoxSchema = SchemaFactory.createForClass(Box);
