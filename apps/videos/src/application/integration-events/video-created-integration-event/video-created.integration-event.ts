import { IntegrationEvent, VIDEO_EVENTS } from '@app/common/events';

import { VideoCreatedDomainEvent } from '@videos/domain/domain-events';

export class VideoCreatedIntegrationEvent implements IntegrationEvent<{
  videoId: string;
  fileIdentifier: string;
}> {
  public readonly eventId: string;
  public readonly occurredAt: string;
  public readonly eventName: string;
  public readonly eventVersion: number;
  public readonly payload: { videoId: string; fileIdentifier: string };

  public constructor(videoCreatedDomainEvent: VideoCreatedDomainEvent) {
    const { eventId, occurredAt, videoId, fileIdentifier } = videoCreatedDomainEvent;
    this.eventId = eventId;
    this.eventVersion = 1;
    this.eventName = VIDEO_EVENTS.VIDEO_PUBLISHED_EVENT;
    this.occurredAt = occurredAt.toISOString();
    this.payload = {
      videoId,
      fileIdentifier,
    };
  }
}
