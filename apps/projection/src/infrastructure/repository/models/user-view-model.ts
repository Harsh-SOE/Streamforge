import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class ProjectedUserCardModel extends Document {
  @Prop({ required: true, index: true })
  userId: string;

  @Prop({ required: true, index: true })
  userAuthId: string;

  @Prop()
  userName: string;

  @Prop()
  avatar: string;

  @Prop({ index: true })
  handle: string;

  @Prop()
  phoneNumber?: string;

  @Prop({ type: Boolean, default: false })
  hasChannel: boolean;

  @Prop()
  dob?: string;
}

export const ProjectUserCardSchema = SchemaFactory.createForClass(
  ProjectedUserCardModel,
);
