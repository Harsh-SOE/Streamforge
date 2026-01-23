import { INTERACTION_EVENTS, IntegrationEvent } from '@app/common/events';

export interface CommentCreatedIntegrationEventPayload {
  commentId: string;
  commentedBy: string;
  commentedOn: string;
  comment: string;
}

export class CommentCreatedIntegrationEvent implements IntegrationEvent<CommentCreatedIntegrationEventPayload> {
  public readonly eventName: string;
  public readonly eventId: string;
  public readonly occurredAt: string;
  public readonly eventVersion: number = 1;
  public readonly eventType: string = 'COMMENT_CREATED';
  public readonly payload: CommentCreatedIntegrationEventPayload;

  public constructor(
    public readonly config: {
      eventId: string;
      occurredAt: string;
      payload: CommentCreatedIntegrationEventPayload;
    },
  ) {
    const {
      eventId,
      occurredAt,
      payload: { comment, commentId, commentedBy, commentedOn },
    } = config;

    this.eventName = INTERACTION_EVENTS;
    this.eventId = eventId;
    this.occurredAt = occurredAt;
    this.payload = {
      commentId,
      commentedBy,
      comment,
      commentedOn,
    };
  }
}
