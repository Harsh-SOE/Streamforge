import { Entity } from '@app/common';
import { BufferMessage } from '@app/common/buffer';

export interface UserProjectionBufferMessagePayload {
  userId: string;
  authId: string;
  email: string;
  handle: string;
  avatar: string;
}

export class UserProjectionBufferMessage implements BufferMessage<
  Entity,
  UserProjectionBufferMessagePayload
> {
  public readonly entity: Entity.USER_PROJECTION;
  public readonly payload: UserProjectionBufferMessagePayload;

  public constructor(payload: UserProjectionBufferMessagePayload) {
    this.payload = payload;
  }
}
