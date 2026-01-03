import { DomainEvent } from '@app/common/events';

export class VideoCreatedDomainEvent implements DomainEvent {
  public readonly eventId: string;
  public readonly occurredAt: Date;

  public constructor(
    public readonly fileIdentifier: string,
    public readonly videoId: string,
  ) {
    this.eventId = videoId;
  }
}
