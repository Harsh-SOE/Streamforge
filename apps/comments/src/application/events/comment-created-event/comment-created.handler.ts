import { NotImplementedException } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { CommentCreatedEvent } from './comment-created.event';

@EventsHandler(CommentCreatedEvent)
export class CommentCreatedEventHandler implements IEventHandler<CommentCreatedEvent> {
  public handle(event: CommentCreatedEvent) {
    throw new NotImplementedException(`Method not implemented for event: ${JSON.stringify(event)}`);
  }
}
