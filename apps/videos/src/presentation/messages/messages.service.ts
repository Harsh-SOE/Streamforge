import { Injectable } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';

import { VideoTranscodedEventDto } from '@app/contracts/video-transcoder';
import { VideoTranscodedDomainEvent } from '@videos/application/integration-events/video-transcoded-integration-event/video-transcoded.event';

@Injectable()
export class MessagesService {
  public constructor(private readonly eventBus: EventBus) {}

  public updateVideoIdentifier(transcodedVideoMessage: VideoTranscodedEventDto) {
    this.eventBus.publish<VideoTranscodedDomainEvent>(
      new VideoTranscodedDomainEvent(
        transcodedVideoMessage.videoId,
        transcodedVideoMessage.newIdentifier,
      ),
    );
  }
}
