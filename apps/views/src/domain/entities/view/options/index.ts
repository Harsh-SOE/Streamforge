import { UserId, VideoId, ViewId } from '@views/domain/value-objects';

export interface ViewEntityOptions {
  readonly id: ViewId;
  readonly userId: UserId;
  readonly videoId: VideoId;
}

export interface ViewSnapshot {
  id: string;
  userId: string;
  videoId: string;
}

export interface ViewEntityCreateOptions {
  id?: string;
  userId: string;
  videoId: string;
}
