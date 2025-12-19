import { CommentId, CommentText, UserId, VideoId } from '@comments/domain/value-objects';

export interface CommentEntityOptions {
  readonly id: CommentId;
  readonly userId: UserId;
  readonly videoId: VideoId;
  commentText: CommentText;
}

export interface CommentEntityCreateOptions {
  id?: string;
  userId: string;
  videoId: string;
  commentText: string;
}

export interface CommentSnapshot {
  id: string;
  userId: string;
  videoId: string;
  commentText: string;
}
