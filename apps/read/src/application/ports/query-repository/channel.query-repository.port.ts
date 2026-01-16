import { ChannelReadModel } from '@read/application/models';

export interface ChannelQueryRepositoryPort {
  getChannelFromId(channelId: string): Promise<ChannelReadModel | null>;
  getChannelFromUserId(userId: string): Promise<ChannelReadModel | null>;
}

export const CHANNEL_QUERY_REPOSITORY_PORT = Symbol('CHANNEL_QUERY_REPOSITORY_PORT');
