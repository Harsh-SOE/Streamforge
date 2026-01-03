import { CHANNEL_EVENTS, IntegrationEvent } from '@app/common/events';

import { ChannelUpdatedDomainEvent } from '@channel/domain/domain-events';

export class ChannelUpdatedIntegrationEvent implements IntegrationEvent<{
  channelId: string;
  userId: string;
  isChannelMonitized: boolean;
  isChannelVerified: boolean;
  bio?: string;
  coverImage?: string;
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
    bio?: string;
    coverImage?: string;
  };

  public constructor(public readonly channelUpdatedDomainEvent: ChannelUpdatedDomainEvent) {
    const {
      eventId,
      occurredAt,
      channelId,
      userId,
      bio,
      coverImage,
      isChannelMonitized,
      isChannelVerified,
    } = channelUpdatedDomainEvent;
    this.eventId = eventId;
    this.eventVersion = 1;
    this.eventName = CHANNEL_EVENTS.CHANNEL_UPDATED;
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
