import { Entity } from '@app/common';
import { BufferMessage } from '@app/common/buffer';

import { UserProjectionBufferMessagePayload } from '../types';

export function isUserProjectionBufferMessage(
  message: BufferMessage<Entity, any>,
): message is BufferMessage<Entity.USER_PROJECTION, UserProjectionBufferMessagePayload> {
  return message.entity === Entity.USER_PROJECTION;
}
