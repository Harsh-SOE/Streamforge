import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { ChannelReadMongooseModel } from '@read/infrastructure/repository/models';
import { ChannelProjectionRepositoryPort } from '@read/application/ports';
import { ChannelProjectionACL } from '@read/infrastructure/anti-corruption';
import { ChannelCreatedProjection } from '@read/application/payload/projection';

@Injectable()
export class ChannelProjectionRepository implements ChannelProjectionRepositoryPort {
  constructor(
    @InjectModel(ChannelReadMongooseModel.name)
    private readonly channelReadModel: Model<ChannelReadMongooseModel>,
    private readonly channelProjectionACL: ChannelProjectionACL,
  ) {}

  public async saveChannel(data: ChannelCreatedProjection): Promise<boolean> {
    await this.channelReadModel.create(
      this.channelProjectionACL.channelCreatedEventToProjectionModel(data),
    );

    return true;
  }

  async saveManyChannels(event: ChannelCreatedProjection[]): Promise<number> {
    const data = event.map((data) =>
      this.channelProjectionACL.channelCreatedEventToProjectionModel(data),
    );
    const savedCards = await this.channelReadModel.insertMany(data);

    return savedCards.length;
  }
}
