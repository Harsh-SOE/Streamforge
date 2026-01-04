import { IntegrationEvent, VIDEO_EVENTS } from '@app/common/events';

export interface VideoCreatedIntegrationEventPayload {
  videoId: string;
  fileIdentifier: string;
}

export class VideoCreatedIntegrationEvent implements IntegrationEvent<VideoCreatedIntegrationEventPayload> {
  public readonly eventId: string;
  public readonly occurredAt: string;
  public readonly eventVersion: number = 1;
  public readonly eventName: string = VIDEO_EVENTS.VIDEO_PUBLISHED_EVENT;
  public readonly payload: VideoCreatedIntegrationEventPayload;

  public constructor(config: {
    eventId: string;
    occurredAt: string;
    payload: VideoCreatedIntegrationEventPayload;
  }) {
    const {
      eventId,
      occurredAt,
      payload: { videoId, fileIdentifier },
    } = config;

    this.eventId = eventId;
    this.occurredAt = occurredAt;
    this.payload = {
      videoId,
      fileIdentifier,
    };
  }
}
