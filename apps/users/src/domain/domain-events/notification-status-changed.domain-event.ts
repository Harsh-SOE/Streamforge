import { DomainEvent } from '@app/common/events';

export class NotificationStatusChangedDomainEvent implements DomainEvent {
  public readonly eventId: string;
  public readonly occurredAt: Date = new Date();

  public constructor(
    public readonly userId: string,
    public readonly status: boolean,
  ) {
    this.eventId = userId;
  }
}
