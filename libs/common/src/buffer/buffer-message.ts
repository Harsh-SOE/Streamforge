import { Entity } from '../entities';

export interface BufferMessage<TEntity extends Entity, TPayload> {
  readonly entity: TEntity;
  readonly payload: TPayload;
}
