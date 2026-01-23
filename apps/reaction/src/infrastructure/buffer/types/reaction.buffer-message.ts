import { Entity } from '@app/common';
import { BufferMessage } from '@app/common/buffer';

import { ReactionBufferMessagePayload } from './reaction.buffer-message.payload';

export class ReactionBufferMessage implements BufferMessage<
  Entity.REACTION,
  ReactionBufferMessagePayload
> {
  public readonly entity = Entity.REACTION;
  public constructor(public readonly payload: ReactionBufferMessagePayload) {}
}
