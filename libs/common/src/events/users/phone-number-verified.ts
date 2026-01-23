import { AGGREGATE_EVENT, IntegrationEvent } from '@app/common/events';

import { USER_EVENTS } from './event-types';

export interface PhoneNumberVerifiedIntegrationEventPayload {
  userId: string;
  phoneNumber: string;
}

export class PhoneNumberVerifiedIntegrationEvent implements IntegrationEvent<PhoneNumberVerifiedIntegrationEventPayload> {
  public readonly eventName: string;
  public readonly eventId: string;
  public readonly eventVersion: number = 1;
  public readonly eventType: string = USER_EVENTS.USER_PHONE_NUMBER_UPDATED_EVENT;
  public readonly occurredAt: string;
  public readonly payload: PhoneNumberVerifiedIntegrationEventPayload;

  public constructor(config: {
    eventId: string;
    occurredAt: string;
    payload: PhoneNumberVerifiedIntegrationEventPayload;
  }) {
    const {
      eventId,
      occurredAt,
      payload: { userId, phoneNumber },
    } = config;

    this.eventName = AGGREGATE_EVENT;
    this.eventId = eventId;
    this.occurredAt = occurredAt;
    this.payload = {
      userId,
      phoneNumber,
    };
  }
}
