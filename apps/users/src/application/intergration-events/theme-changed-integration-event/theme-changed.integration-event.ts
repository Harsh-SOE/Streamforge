import { IntegrationEvent, USERS_EVENTS } from '@app/common/events';

import { ThemeChangedDomainEvent } from '@users/domain/domain-events';

export class ThemeChangedIntegrationEvent implements IntegrationEvent<{
  userId: string;
  theme: string;
}> {
  public readonly eventName: string;
  public readonly eventVersion: number;
  public readonly eventId: string;
  public readonly occurredAt: string;
  public readonly payload: { userId: string; theme: string };

  public constructor(themeChangedDomainEvent: ThemeChangedDomainEvent) {
    const { eventId, occurredAt, userId, theme } = themeChangedDomainEvent;
    this.eventId = eventId;
    this.eventVersion = 1;
    this.eventName = USERS_EVENTS.USER_THEME_CHANGED_EVENT;
    this.occurredAt = occurredAt.toISOString();
    this.payload = {
      userId,
      theme,
    };
  }
}
