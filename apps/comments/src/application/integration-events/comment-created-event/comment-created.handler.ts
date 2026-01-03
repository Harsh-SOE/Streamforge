import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import { EVENT_PUBLISHER, EventsPublisher } from '@app/common/ports/events';

import { ChannelCreatedDomainEvent } from '@channel/domain/domain-events';
import { ChannelCreatedIntegrationEvent } from '@channel/application/integration-events';

@EventsHandler(ChannelCreatedDomainEvent)
export class CommentCreatedEventHandler implements IEventHandler<ChannelCreatedDomainEvent> {
  public constructor(@Inject(EVENT_PUBLISHER) private readonly eventPublisher: EventsPublisher) {}

  public async handle(channelCreatedDomainEvent: ChannelCreatedDomainEvent) {
    const channelCreatedInetgrationEvent = new ChannelCreatedIntegrationEvent(
      channelCreatedDomainEvent,
    );

    await this.eventPublisher.publishMessage(channelCreatedInetgrationEvent);
  }
}
