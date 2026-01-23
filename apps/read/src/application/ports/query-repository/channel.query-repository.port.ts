import { ChannelQuery } from '@read/application/payload/query';

export interface ChannelQueryRepositoryPort {
  getChannelFromId(channelId: string): Promise<ChannelQuery | null>;
  getChannelFromUserId(userId: string): Promise<ChannelQuery | null>;
}

export const CHANNEL_QUERY_REPOSITORY_PORT = Symbol('CHANNEL_QUERY_REPOSITORY_PORT');
