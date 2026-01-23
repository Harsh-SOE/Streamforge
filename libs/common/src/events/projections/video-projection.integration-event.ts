import { v4 as uuidv4 } from 'uuid';

import { IntegrationEvent, PROJECTION_EVENT } from '@app/common/events';

export interface VideoProjectionEventPayload {
  videoId: string;
  userId: string;
  channelId: string;
  title: string;
  visibility: string;
  description?: string;
  fileIdentifier: string;
  categories: Array<string>;
  thumbnailIdentifier: string;
}

export class VideoProjectionEvent implements IntegrationEvent<VideoProjectionEventPayload> {
  public readonly eventVersion: number = 1;
  public readonly eventId: string = uuidv4();
  public readonly eventName: string = PROJECTION_EVENT;
  public readonly occurredAt: string = new Date().toISOString();
  public readonly eventType: string = 'VIDEO_PROJECTION_BUFFER_EVENT';
  public readonly payload: VideoProjectionEventPayload;

  public constructor(payload: VideoProjectionEventPayload) {
    this.payload = payload;
  }
}
