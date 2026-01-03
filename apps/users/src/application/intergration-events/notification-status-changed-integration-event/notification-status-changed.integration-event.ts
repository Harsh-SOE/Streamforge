import { IntegrationEvent, USERS_EVENTS } from '@app/common/events';

import { NotificationStatusChangedDomainEvent } from '@users/domain/domain-events';

export class NotificationStatusChangedIntegrationEvent implements IntegrationEvent<{
  userId: string;
  status: boolean;
}> {
  public readonly eventName: string;
  public readonly eventVersion: number;
  public readonly eventId: string;
  public readonly occurredAt: string;
  public readonly payload: { userId: string; status: boolean };

  public constructor(notificationStatusChangedDomainEvent: NotificationStatusChangedDomainEvent) {
    const { eventId, occurredAt, userId, status } = notificationStatusChangedDomainEvent;
    this.eventId = eventId;
    this.eventVersion = 1;
    this.eventName = USERS_EVENTS.USER_NOTIFICATION_CHANGED_EVENT;
    this.occurredAt = occurredAt.toISOString();
    this.payload = {
      userId,
      status,
    };
  }
}
