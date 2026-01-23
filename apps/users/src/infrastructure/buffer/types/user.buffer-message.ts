import { Entity } from '@app/common';
import { BufferMessage } from '@app/common/buffer';

import { UserOnBoardedBufferMessagePayload } from './user.buffer-message.payload';

export class UserOnBoardedBufferMessage implements BufferMessage<
  Entity,
  UserOnBoardedBufferMessagePayload
> {
  public readonly entity = Entity.USER;
  public constructor(public readonly payload: UserOnBoardedBufferMessagePayload) {}
}
