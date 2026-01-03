import { COMMENT_EVENTS, IntegrationEvent } from '@app/common/events';

import { CommentCreatedDomainEvent } from '@comments/domain/domain-events';

export class CommentCreatedIntegrationEvent implements IntegrationEvent<{
  commentId: string;
  commentedBy: string;
  commentedOn: string;
  comment: string;
}> {
  public readonly eventName: string;
  public readonly eventVersion: number;
  public readonly eventId: string;
  public readonly occurredAt: string;
  public readonly payload: {
    commentId: string;
    commentedBy: string;
    commentedOn: string;
    comment: string;
  };

  public constructor(public readonly commentCreatedDomainEvent: CommentCreatedDomainEvent) {
    const { eventId, occurredAt, commentId, commentedBy, comment, commentedOn } =
      commentCreatedDomainEvent;
    this.eventId = eventId;
    this.eventVersion = 1;
    this.eventName = COMMENT_EVENTS.COMMENT_CREATED;
    this.occurredAt = occurredAt.toISOString();
    this.payload = {
      commentId,
      commentedBy,
      comment,
      commentedOn,
    };
  }
}
