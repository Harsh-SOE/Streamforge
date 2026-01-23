import { AGGREGATE_EVENT, IntegrationEvent } from '@app/common/events';

export interface ChannelCreatedIntegrationEventPayload {
  channelId: string;
  userId: string;
  isChannelMonitized: boolean;
  isChannelVerified: boolean;
  coverImage?: string;
  bio?: string;
}

export class ChannelCreatedIntegrationEvent implements IntegrationEvent<ChannelCreatedIntegrationEventPayload> {
  public readonly eventType: string;
  public readonly eventName: string;
  public readonly eventVersion: number = 1;
  public readonly eventId: string;
  public readonly occurredAt: string;
  public readonly payload: ChannelCreatedIntegrationEventPayload;

  public constructor(
    public readonly channelCreatedDomainEvent: {
      eventId: string;
      occurredAt: Date;
      payload: ChannelCreatedIntegrationEventPayload;
    },
  ) {
    const {
      eventId,
      occurredAt,
      payload: { channelId, userId, bio, coverImage, isChannelMonitized, isChannelVerified },
    } = channelCreatedDomainEvent;
    this.eventId = eventId;
    this.eventName = AGGREGATE_EVENT;
    this.eventType = 'CHANNEL_CREATED';
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
