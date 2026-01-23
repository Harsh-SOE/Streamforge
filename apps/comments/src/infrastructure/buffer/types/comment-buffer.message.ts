import { Entity } from '@app/common';
import { BufferMessage } from '@app/common/buffer';

export interface CommentBufferEventPayload {
  commentId: string;
  userId: string;
  videoId: string;
  commentText: string;
}

export class CommentBufferMessage implements BufferMessage<
  Entity.COMMENT,
  CommentBufferEventPayload
> {
  public readonly entity = Entity.COMMENT;
  public constructor(public readonly payload: CommentBufferEventPayload) {}
}
