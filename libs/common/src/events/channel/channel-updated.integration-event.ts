import { AGGREGATE_EVENT, IntegrationEvent } from '@app/common/events';

export interface ChannelUpdatedIntegrationEventPayload {
  channelId: string;
  userId: string;
  isChannelMonitized: boolean;
  isChannelVerified: boolean;
  bio?: string;
  coverImage?: string;
}

export class ChannelUpdatedIntegrationEvent implements IntegrationEvent<ChannelUpdatedIntegrationEventPayload> {
  public readonly eventName: string;
  public readonly eventId: string;
  public readonly occurredAt: string;
  public readonly eventVersion: number = 1;
  public readonly eventType: string = 'CHANNEL_UPDATED';
  public readonly payload: ChannelUpdatedIntegrationEventPayload;

  public constructor(
    public readonly channelUpdatedDomainEvent: {
      eventId: string;
      occurredAt: string;
      payload: ChannelUpdatedIntegrationEventPayload;
    },
  ) {
    const {
      eventId,
      occurredAt,
      payload: { channelId, isChannelMonitized, isChannelVerified, userId, bio, coverImage },
    } = channelUpdatedDomainEvent;

    this.eventName = AGGREGATE_EVENT;
    this.eventId = eventId;
    this.occurredAt = occurredAt;
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
