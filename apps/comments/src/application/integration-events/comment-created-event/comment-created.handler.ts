import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import { EVENT_PUBLISHER_PORT, EventsPublisherPort } from '@app/common/ports/events';

import { ChannelCreatedDomainEvent } from '@channel/domain/domain-events';
import { ChannelCreatedIntegrationEvent } from '@channel/application/integration-events';

@EventsHandler(ChannelCreatedDomainEvent)
export class CommentCreatedEventHandler implements IEventHandler<ChannelCreatedDomainEvent> {
  public constructor(
    @Inject(EVENT_PUBLISHER_PORT) private readonly eventPublisher: EventsPublisherPort,
  ) {}

  public async handle(channelCreatedDomainEvent: ChannelCreatedDomainEvent) {
    const channelCreatedInetgrationEvent = new ChannelCreatedIntegrationEvent(
      channelCreatedDomainEvent,
    );

    await this.eventPublisher.publishMessage(channelCreatedInetgrationEvent);
  }
}
