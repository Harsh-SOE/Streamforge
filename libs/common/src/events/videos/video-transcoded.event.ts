import { AGGREGATE_EVENT, IntegrationEvent } from '@app/common/events';

export interface VideoTranscodedIntegrationEventPayload {
  videoId: string;
  newIdentifier: string;
}

export class VideoTranscodedIntegrationEvent implements IntegrationEvent<VideoTranscodedIntegrationEventPayload> {
  public readonly eventName: string;
  public readonly eventId: string;
  public readonly occurredAt: string;
  public readonly eventVersion: number = 1;
  public readonly eventType: string = 'VIDEO_TRANSCODED_EVENT';
  public readonly payload: VideoTranscodedIntegrationEventPayload;

  public constructor(
    public readonly config: {
      eventId: string;
      occurredAt: string;
      payload: VideoTranscodedIntegrationEventPayload;
    },
  ) {
    const {
      eventId,
      occurredAt,
      payload: { videoId, newIdentifier },
    } = config;

    this.eventName = AGGREGATE_EVENT;
    this.eventId = eventId;
    this.occurredAt = occurredAt;
    this.payload = {
      videoId,
      newIdentifier,
    };
  }
}
