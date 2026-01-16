import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import {
  ChannelCreatedIntegrationEvent,
  ChannelUpdatedIntegrationEvent,
} from '@app/common/events/channel';

import { ChannelReadMongooseModel } from '@read/infrastructure/repository/models';
import { ChannelProjectionRepositoryPort } from '@read/application/ports';
import { ChannelProjectionACL } from '@read/infrastructure/anti-corruption';

@Injectable()
export class ChannelProjectionRepository implements ChannelProjectionRepositoryPort {
  constructor(
    @InjectModel(ChannelReadMongooseModel.name)
    private readonly channelReadModel: Model<ChannelReadMongooseModel>,
    private readonly channelProjectionACL: ChannelProjectionACL,
  ) {}

  public async saveChannel(data: ChannelCreatedIntegrationEvent): Promise<boolean> {
    await this.channelReadModel.create(
      this.channelProjectionACL.channelCreatedEventToProjectionModel(data),
    );

    return true;
  }

  async saveManyChannels(event: ChannelCreatedIntegrationEvent[]): Promise<number> {
    const data = event.map((data) =>
      this.channelProjectionACL.channelCreatedEventToProjectionModel(data),
    );
    const savedCards = await this.channelReadModel.insertMany(data);

    return savedCards.length;
  }

  public async updateChannel(
    videoId: string,
    event: ChannelUpdatedIntegrationEvent,
  ): Promise<boolean> {
    const updated = await this.channelReadModel.findOneAndUpdate(
      { videoId },
      { $set: this.channelProjectionACL.channelUpdatedEventToProjectionModel(event) },
      { new: true },
    );

    return updated ? true : false;
  }

  public async deleteChannel(videoId: string): Promise<boolean> {
    const result = await this.channelReadModel.deleteOne({ videoId });
    return result.acknowledged;
  }
}
