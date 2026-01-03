import { DomainEvent } from '@app/common/events';

export class VideoTranscodedDomainEvent implements DomainEvent {
  public readonly eventId: string;
  public readonly occurredAt: Date;

  public constructor(
    public readonly videoId: string,
    public readonly newIdentifier: string,
  ) {}
}
