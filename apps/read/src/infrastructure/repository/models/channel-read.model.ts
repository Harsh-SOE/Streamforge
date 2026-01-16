import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class ChannelReadMongooseModel extends Document {
  @Prop({ type: String, unique: true, required: true, index: true })
  channelId: string;

  @Prop({ type: String, unique: true, required: true, index: true })
  userId: string;

  @Prop({ type: String, unique: true, required: true, index: true })
  handle: string;

  @Prop()
  coverImage: string;

  @Prop()
  bio: string;

  @Prop({ type: Number, default: 0 })
  subscribers: number;

  @Prop({ type: Number, default: 0 })
  videoCount: number;
}

export const ChannelReadMongooseSchema = SchemaFactory.createForClass(ChannelReadMongooseModel);
