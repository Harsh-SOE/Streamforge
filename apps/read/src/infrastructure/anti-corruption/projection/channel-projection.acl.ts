import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { ChannelReadMongooseModel } from '@read/infrastructure/repository/models';
import { ChannelCreatedProjection } from '@read/application/payload/projection';

@Injectable()
export class ChannelProjectionACL {
  public constructor(
    @InjectModel(ChannelReadMongooseModel.name)
    private readonly channelProjectionModel: Model<ChannelReadMongooseModel>,
  ) {}

  public channelCreatedEventToProjectionModel(
    payload: ChannelCreatedProjection,
  ): ChannelReadMongooseModel {
    const { channelId, userId, bio, coverImage } = payload;

    return new this.channelProjectionModel({
      userId,
      channelId,
      bio,
      coverImage,
    });
  }
}
