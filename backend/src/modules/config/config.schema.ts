import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ConfigDocument = Config & Document;

@Schema({ timestamps: true })
export class Config {
  @Prop({ required: true, unique: true })
  key: string;

  @Prop({ type: Object })
  value: any;

  @Prop()
  description: string;

  @Prop({ default: true })
  isPublic: boolean;
}

export const ConfigSchema = SchemaFactory.createForClass(Config);
