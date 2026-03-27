import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OrderDocument = Order & Document;

@Schema({ timestamps: true })
export class Order {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true, type: Array })
  items: any[];

  @Prop({ required: true })
  totalPoints: number;

  @Prop({ required: true })
  status: string;

  @Prop()
  shippingAddress: string;

  @Prop()
  trackingNumber: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
