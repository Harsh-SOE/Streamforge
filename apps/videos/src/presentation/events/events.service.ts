import { EventBus } from '@nestjs/cqrs';
import { Injectable } from '@nestjs/common';

import { VideoTranscodedDomainEvent } from '@videos/domain/domain-events';
import { VideoTranscodedIntegratedEvent } from '@app/common/events/videos';

@Injectable()
export class EventsService {
  public constructor(private readonly eventBus: EventBus) {}

  public async onVideoTranscoded(videoTranscodedIntegratedEvent: VideoTranscodedIntegratedEvent) {
    await this.eventBus.publish<VideoTranscodedDomainEvent>(
      new VideoTranscodedDomainEvent(
        videoTranscodedIntegratedEvent.payload.videoId,
        videoTranscodedIntegratedEvent.payload.newIdentifier,
      ),
    );
  }
}
