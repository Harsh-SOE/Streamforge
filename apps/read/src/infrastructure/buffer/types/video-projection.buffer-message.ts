import { Entity } from '@app/common';
import { BufferMessage } from '@app/common/buffer';

export interface VideoProjectionBufferMessagePayload {
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

export class VideoProjectionBufferMessage implements BufferMessage<
  Entity,
  VideoProjectionBufferMessagePayload
> {
  public readonly entity = Entity.VIDEO_PROJECTION;
  public constructor(public readonly payload: VideoProjectionBufferMessagePayload) {}
}
