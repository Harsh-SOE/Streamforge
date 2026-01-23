import { v4 as uuidv4 } from 'uuid';

import { IntegrationEvent, PROJECTION_EVENT } from '@app/common/events';

import { PROJECTION_EVENTS } from './event-types';

export interface ChannelCreatedProjectionEventPayload {
  channelId: string;
  userId: string;
  isChannelMonitized: boolean;
  isChannelVerified: boolean;
  coverImage?: string;
  bio?: string;
}

export class ChannelCreatedProjectionEvent implements IntegrationEvent<ChannelCreatedProjectionEventPayload> {
  public readonly eventVersion: number = 1;
  public readonly eventId: string = uuidv4();
  public readonly eventName: string = PROJECTION_EVENT;
  public readonly occurredAt: string = new Date().toISOString();
  public readonly eventType: string = PROJECTION_EVENTS.VIDEO_PUBLISHED_PROJECTION_EVENT;
  public readonly payload: ChannelCreatedProjectionEventPayload;

  public constructor(payload: ChannelCreatedProjectionEventPayload) {
    this.payload = payload;
  }
}
