import { IntegrationEvent, USERS_EVENTS } from '@app/common/events';

import { OnboardedDomainEvent } from '@users/domain/domain-events';

export class OnboardedIntegrationEvent implements IntegrationEvent<{
  userId: string;
  authId: string;
  email: string;
  handle: string;
}> {
  public readonly eventName: string;
  public readonly eventVersion: number;
  public readonly eventId: string;
  public readonly occurredAt: string;
  public readonly payload: { userId: string; authId: string; email: string; handle: string };

  public constructor(onboardedDomainEvent: OnboardedDomainEvent) {
    const { eventId, occurredAt, userId, authId, email, handle } = onboardedDomainEvent;
    this.eventId = eventId;
    this.eventVersion = 1;
    this.eventName = USERS_EVENTS.USER_ONBOARDED_EVENT;
    this.occurredAt = occurredAt.toISOString();
    this.payload = {
      userId,
      authId,
      email,
      handle,
    };
  }
}
