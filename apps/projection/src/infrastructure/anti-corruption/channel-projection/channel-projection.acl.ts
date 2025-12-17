import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { ChannelCreatedEventDto } from '@app/contracts/channel';

import { ChannelProjectionModel } from '@projection/infrastructure/repository/models';

@Injectable()
export class ChannelProjectionACL {
  public constructor(
    @InjectModel(ChannelProjectionModel.name)
    private readonly channelCard: Model<ChannelProjectionModel>,
  ) {}

  public channelCreatedEventToPersistance(event: ChannelCreatedEventDto): ChannelProjectionModel {
    return new this.channelCard({
      userId: event.userId,
      channelId: event.id,
      bio: event.bio,
      handle: event.handle,
      coverImage: event.coverImage,
    });
  }
}
