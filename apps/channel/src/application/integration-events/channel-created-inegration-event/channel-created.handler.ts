import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { EVENT_PUBLISHER_PORT, EventsPublisherPort } from '@app/common/ports/events';

import { ChannelCreatedDomainEvent } from '@channel/domain/domain-events';

import { ChannelCreatedIntegrationEvent } from './channel-created.integration-event';

@EventsHandler(ChannelCreatedDomainEvent)
export class ChannelCreatedEventHandler implements IEventHandler<ChannelCreatedDomainEvent> {
  public constructor(
    @Inject(EVENT_PUBLISHER_PORT) private readonly eventPublisher: EventsPublisherPort,
  ) {}

  async handle(channelCreatedDomainEvent: ChannelCreatedDomainEvent) {
    const channelCreatedIntegrationEvent = new ChannelCreatedIntegrationEvent(
      channelCreatedDomainEvent,
    );

    await this.eventPublisher.publishMessage(channelCreatedIntegrationEvent);
  }
}
