import { Entity } from '@app/common';
import { BufferMessage } from '@app/common/buffer';

import { VideoProjectionBufferMessagePayload } from '../types';

export function isVideoProjectionBufferMessage(
  message: BufferMessage<Entity, any>,
): message is BufferMessage<Entity.VIDEO_PROJECTION, VideoProjectionBufferMessagePayload> {
  return message.entity === Entity.VIDEO_PROJECTION;
}
