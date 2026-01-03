import { CHANNEL_EVENTS, IntegrationEvent } from '@app/common/events';

import { ChannelMonitizedDomainEvent } from '@channel/domain/domain-events';

export class ChannelMonitizedIntegrationEvent implements IntegrationEvent<{
  channelId: string;
  isChannelMonitized: boolean;
}> {
  public readonly eventId: string;
  public readonly occurredAt: string;
  public readonly eventName: string;
  public readonly eventVersion: number;
  public readonly payload: { channelId: string; isChannelMonitized: boolean };

  public constructor(public readonly channelMonitizedDomainEvent: ChannelMonitizedDomainEvent) {
    const { eventId, occurredAt, channelId, isChannelMonitized } = channelMonitizedDomainEvent;
    this.eventId = eventId;
    this.eventVersion = 1;
    this.eventName = CHANNEL_EVENTS.CHANNEL_MONITIZED;
    this.occurredAt = occurredAt.toISOString();
    this.payload = {
      channelId,
      isChannelMonitized,
    };
  }
}
