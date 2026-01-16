import { Injectable } from '@nestjs/common';

import { ChannelReadModel } from '@read/application/models';
import { ChannelReadMongooseModel } from '@read/infrastructure/repository/models';

@Injectable()
export class ChannelQueryACL {
  public channelProjectionSchemaToQueryModel(
    channelReadModel: ChannelReadMongooseModel,
  ): ChannelReadModel {
    return {
      channelId: channelReadModel.channelId,
      userId: channelReadModel.userId,
      bio: channelReadModel.bio,
      coverImage: channelReadModel.coverImage,
      handle: channelReadModel.handle,
      subscribers: channelReadModel.subscribers,
      videoCount: channelReadModel.videoCount,
    };
  }
}
