import { Entity } from '@app/common';
import { BufferMessage } from '@app/common/buffer';

import { ReactionBufferMessagePayload } from '../types';

export function isReactionBufferMessage(
  message: BufferMessage<Entity, any>,
): message is BufferMessage<Entity.REACTION, ReactionBufferMessagePayload> {
  return message.entity === Entity.REACTION;
}
