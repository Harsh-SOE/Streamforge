import { IntegrationEvent, USERS_EVENTS } from '@app/common/events';

import { LanguageChangedDomainEvent } from '@users/domain/domain-events';

export class LanguageChangedIntergrationEvent implements IntegrationEvent<{
  userId: string;
  language: string;
}> {
  public readonly eventName: string;
  public readonly eventVersion: number;
  public readonly eventId: string;
  public readonly occurredAt: string;
  public readonly payload: { userId: string; language: string };

  public constructor(languageChangedDomainEvent: LanguageChangedDomainEvent) {
    const { eventId, occurredAt, userId, language } = languageChangedDomainEvent;
    this.eventId = eventId;
    this.eventVersion = 1;
    this.eventName = USERS_EVENTS.USER_LANGUAGE_CHANGED_EVENT;
    this.occurredAt = occurredAt.toISOString();
    this.payload = {
      userId,
      language,
    };
  }
}
