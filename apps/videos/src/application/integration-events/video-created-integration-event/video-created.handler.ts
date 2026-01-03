import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { EVENT_PUBLISHER, EventsPublisher } from '@app/common/ports/events';

import { VideoCreatedDomainEvent } from '@videos/domain/domain-events';

import { VideoCreatedIntegrationEvent } from './video-created.integration-event';

@EventsHandler(VideoCreatedDomainEvent)
export class VideoCreatedEventHandler implements IEventHandler<VideoCreatedDomainEvent> {
  constructor(@Inject(EVENT_PUBLISHER) private eventConsumer: EventsPublisher) {}

  public async handle(videoCreatedDomainEvent: VideoCreatedDomainEvent) {
    const videoCreatedIntegrationEvent = new VideoCreatedIntegrationEvent(videoCreatedDomainEvent);

    await this.eventConsumer.publishMessage(videoCreatedIntegrationEvent);
  }
}
