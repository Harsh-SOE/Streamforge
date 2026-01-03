import { IntegrationEvent, USERS_EVENTS } from '@app/common/events';

import { PhoneNumberVerifiedDomainEvent } from '@users/domain/domain-events';

export class PhoneNumberVerifiedIntegrationEvent implements IntegrationEvent<{
  userId: string;
  phoneNumber: string;
}> {
  public readonly eventName: string;
  public readonly eventVersion: number;
  public readonly eventId: string;
  public readonly occurredAt: string;
  public readonly payload: { userId: string; phoneNumber: string };

  public constructor(onboardedDomainEvent: PhoneNumberVerifiedDomainEvent) {
    const { eventId, occurredAt, userId, phoneNumber } = onboardedDomainEvent;
    this.eventId = eventId;
    this.eventVersion = 1;
    this.eventName = USERS_EVENTS.USER_PHONE_NUMBER_UPDATED_EVENT;
    this.occurredAt = occurredAt.toISOString();
    this.payload = {
      userId,
      phoneNumber,
    };
  }
}
