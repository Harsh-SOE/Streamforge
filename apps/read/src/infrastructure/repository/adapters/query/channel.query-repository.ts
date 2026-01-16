import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { ChannelReadModel } from '@read/application/models';
import { ChannelQueryACL } from '@read/infrastructure/anti-corruption';
import { ChannelReadMongooseModel } from '@read/infrastructure/repository/models';
import { ChannelQueryRepositoryPort } from '@read/application/ports/query-repository';

@Injectable()
export class ChannelQueryRepository implements ChannelQueryRepositoryPort {
  constructor(
    @InjectModel(ChannelReadMongooseModel.name)
    private readonly projectedChannelModel: Model<ChannelReadMongooseModel>,
    private readonly channelQueryACL: ChannelQueryACL,
  ) {}

  public async getChannelFromId(id: string): Promise<ChannelReadModel | null> {
    const channel = await this.projectedChannelModel.findById(id);

    return channel ? this.channelQueryACL.channelProjectionSchemaToQueryModel(channel) : null;
  }

  public async getChannelFromUserId(userId: string): Promise<ChannelReadModel | null> {
    const channel = await this.projectedChannelModel.findOne({ userAuthId: userId });

    return channel ? this.channelQueryACL.channelProjectionSchemaToQueryModel(channel) : null;
  }
}
