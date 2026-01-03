import { IntegrationEvent, USERS_EVENTS } from '@app/common/events';

import { ProfileUpdatedDomainEvent } from '@users/domain/domain-events';

export class ProfileUpdatedIntegrationEvent implements IntegrationEvent<{
  userId: string;
  avatar?: string;
  dob?: string;
  phoneNumber?: string;
}> {
  public readonly eventName: string;
  public readonly eventVersion: number;
  public readonly eventId: string;
  public readonly occurredAt: string;
  public readonly payload: { userId: string; avatar?: string; dob?: string; phoneNumber?: string };

  public constructor(profileUpdatedDomainEvent: ProfileUpdatedDomainEvent) {
    const { eventId, occurredAt, userId, avatar, dob, phoneNumber } = profileUpdatedDomainEvent;
    this.eventId = eventId;
    this.eventVersion = 1;
    this.eventName = USERS_EVENTS.USER_PROFILE_UPDATED_EVENT;
    this.occurredAt = occurredAt.toISOString();
    this.payload = {
      userId,
      avatar,
      dob,
      phoneNumber,
    };
  }
}
