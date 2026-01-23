import { Entity } from '@app/common';
import { BufferMessage } from '@app/common/buffer';

import { CommentBufferMessagePayload } from '../types';

export function isCommentBufferMessage(
  message: BufferMessage<Entity, any>,
): message is BufferMessage<Entity.COMMENT, CommentBufferMessagePayload> {
  return message.entity === Entity.COMMENT;
}
