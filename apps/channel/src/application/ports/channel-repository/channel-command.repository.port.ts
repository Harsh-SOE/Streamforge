import { ChannelAggregate } from '@channel/domain/aggregates';

export interface ChannelCommandRepositoryPort {
  saveChannel(domain: ChannelAggregate): Promise<ChannelAggregate>;

  saveManyChannels(domains: ChannelAggregate[]): Promise<number>;

  findOneChannelById(channelId: string): Promise<ChannelAggregate | null>;

  findOneChannelByUserId(userId: string): Promise<ChannelAggregate | null>;

  updateOneChannelById(
    channelId: string,
    updatedChannel: ChannelAggregate,
  ): Promise<ChannelAggregate>;

  updateOneChannelByUserId(
    userId: string,
    updatedChannel: ChannelAggregate,
  ): Promise<ChannelAggregate>;

  deleteOneChannelById(channelId: string): Promise<boolean>;

  deleteOneChannelByUserId(userId: string): Promise<boolean>;
}

export const CHANNEL_REPOSITORY = Symbol('CHANNEL_REPOSITORY');
