import { Entity } from '@app/common';
import { BufferMessage } from '@app/common/buffer';

import { ViewBufferMessagePayload } from '../types';

export function isViewBufferMessage(
  message: BufferMessage<Entity, any>,
): message is BufferMessage<Entity.VIEW, ViewBufferMessagePayload> {
  return message.entity === Entity.VIEW;
}
