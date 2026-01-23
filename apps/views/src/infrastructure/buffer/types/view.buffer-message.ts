import { Entity } from '@app/common';
import { BufferMessage } from '@app/common/buffer';

import { ViewBufferMessagePayload } from './view.buffer-message.payload';

export class ViewBufferMessage implements BufferMessage<Entity, ViewBufferMessagePayload> {
  public readonly entity = Entity.VIEW;
  public constructor(public readonly payload: ViewBufferMessagePayload) {}
}
