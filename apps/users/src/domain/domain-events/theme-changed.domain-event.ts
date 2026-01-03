import { DomainEvent } from '@app/common/events';

export class ThemeChangedDomainEvent implements DomainEvent {
  public readonly eventId: string;
  public readonly occurredAt: Date = new Date();

  public constructor(
    public readonly userId: string,
    public readonly theme: string,
  ) {
    this.eventId = userId;
  }
}
