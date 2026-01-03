import { CHANNEL_EVENTS, IntegrationEvent } from '@app/common/events';

import { ChannelCreatedDomainEvent } from '@channel/domain/domain-events';

export class ChannelCreatedIntegrationEvent implements IntegrationEvent<{
  channelId: string;
  userId: string;
  isChannelMonitized: boolean;
  isChannelVerified: boolean;
  coverImage?: string;
  bio?: string;
}> {
  public readonly eventName: string;
  public readonly eventVersion: number;
  public readonly eventId: string;
  public readonly occurredAt: string;
  public readonly payload: {
    channelId: string;
    userId: string;
    isChannelMonitized: boolean;
    isChannelVerified: boolean;
    coverImage?: string;
    bio?: string;
  };
  public constructor(public readonly channelCreatedDomainEvent: ChannelCreatedDomainEvent) {
    const {
      eventId,
      occurredAt,
      channelId,
      userId,
      bio,
      coverImage,
      isChannelMonitized,
      isChannelVerified,
    } = channelCreatedDomainEvent;
    this.eventId = eventId;
    this.eventVersion = 1;
    this.eventName = CHANNEL_EVENTS.CHANNEL_CREATED;
    this.occurredAt = occurredAt.toISOString();
    this.payload = {
      channelId,
      userId,
      bio,
      coverImage,
      isChannelMonitized,
      isChannelVerified,
    };
  }
}
