import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class UserReadMongooseModel extends Document {
  @Prop({ required: true, index: true })
  userId: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, index: true })
  userAuthId: string;

  @Prop({ index: true, required: true })
  handle: string;

  @Prop()
  fullName: string;

  @Prop({ required: true })
  avatar: string;

  @Prop()
  phoneNumber?: string;

  @Prop({ type: Boolean, default: false })
  isPhoneNumberVerified: boolean;

  @Prop()
  dob?: string;
}

export const UserReadMongooseSchema = SchemaFactory.createForClass(UserReadMongooseModel);
