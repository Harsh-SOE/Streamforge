import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { EVENT_PUBLISHER_PORT, EventsPublisherPort } from '@app/common/ports/events';

import { VideoCreatedDomainEvent } from '@videos/domain/domain-events';

import { VideoCreatedIntegrationEvent } from './video-created.integration-event';

@EventsHandler(VideoCreatedDomainEvent)
export class VideoCreatedEventHandler implements IEventHandler<VideoCreatedDomainEvent> {
  constructor(@Inject(EVENT_PUBLISHER_PORT) private eventConsumer: EventsPublisherPort) {}

  public async handle(videoCreatedDomainEvent: VideoCreatedDomainEvent) {
    const videoCreatedIntegrationEvent = new VideoCreatedIntegrationEvent(videoCreatedDomainEvent);

    await this.eventConsumer.publishMessage(videoCreatedIntegrationEvent);
  }
}
