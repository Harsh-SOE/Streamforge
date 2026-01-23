import { ChannelCreatedProjection } from '@read/application/payload/projection';

export interface ChannelProjectionRepositoryPort {
  saveChannel(data: ChannelCreatedProjection): Promise<boolean>;

  saveManyChannels(data: ChannelCreatedProjection[]): Promise<number>;

  // todo: make projection events for channel updated and deleted
}

export const CHANNEL_PROJECTION_REPOSITORY_PORT = Symbol('CHANNEL_PROJECTION_REPOSITORY_PORT');
