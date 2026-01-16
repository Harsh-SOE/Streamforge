import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import {
  ChannelCreatedIntegrationEvent,
  ChannelUpdatedIntegrationEvent,
} from '@app/common/events/channel';

import { ChannelReadMongooseModel } from '@read/infrastructure/repository/models';

@Injectable()
export class ChannelProjectionACL {
  public constructor(
    @InjectModel(ChannelReadMongooseModel.name)
    private readonly channelProjectionModel: Model<ChannelReadMongooseModel>,
  ) {}

  public channelCreatedEventToProjectionModel(
    event: ChannelCreatedIntegrationEvent,
  ): ChannelReadMongooseModel {
    const { channelId, userId, bio, coverImage } = event.payload;

    return new this.channelProjectionModel({
      userId,
      channelId,
      bio,
      coverImage,
    });
  }

  public channelUpdatedEventToProjectionModel(
    event: ChannelUpdatedIntegrationEvent,
  ): ChannelReadMongooseModel {
    const { channelId, userId, bio, coverImage } = event.payload;

    return new this.channelProjectionModel({
      userId,
      channelId,
      bio,
      coverImage,
    });
  }
}
