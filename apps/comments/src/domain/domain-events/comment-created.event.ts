import { DomainEvent } from '@app/common/events';

export class CommentCreatedDomainEvent implements DomainEvent {
  public readonly eventId: string;
  public readonly occurredAt: Date = new Date();

  public constructor(
    public readonly commentId: string,
    public readonly commentedBy: string,
    public readonly commentedOn: string,
    public readonly comment: string,
  ) {
    this.eventId = commentId;
  }
}
