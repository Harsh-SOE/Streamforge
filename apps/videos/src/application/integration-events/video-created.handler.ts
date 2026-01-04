import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { VideoCreatedIntegrationEvent } from '@app/common/events/videos';
import { EVENT_PUBLISHER_PORT, EventsPublisherPort } from '@app/common/ports/events';

import { VideoCreatedDomainEvent } from '@videos/domain/domain-events';

@EventsHandler(VideoCreatedDomainEvent)
export class VideoCreatedEventHandler implements IEventHandler<VideoCreatedDomainEvent> {
  constructor(@Inject(EVENT_PUBLISHER_PORT) private eventConsumer: EventsPublisherPort) {}

  public async handle(videoCreatedDomainEvent: VideoCreatedDomainEvent) {
    const videoCreatedIntegrationEvent = new VideoCreatedIntegrationEvent({
      eventId: videoCreatedDomainEvent.eventId,
      occurredAt: videoCreatedDomainEvent.occurredAt.toISOString(),
      payload: {
        videoId: videoCreatedDomainEvent.videoId,
        fileIdentifier: videoCreatedDomainEvent.fileIdentifier,
      },
    });

    await this.eventConsumer.publishMessage(videoCreatedIntegrationEvent);
  }
}
