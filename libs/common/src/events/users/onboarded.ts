import { AGGREGATE_EVENT, IntegrationEvent } from '@app/common/events';

import { USER_EVENTS } from './event-types';

export interface OnboardedIntegrationEventPayload {
  userId: string;
  authId: string;
  email: string;
  handle: string;
  avatar: string;
}

export class OnboardedIntegrationEvent implements IntegrationEvent<OnboardedIntegrationEventPayload> {
  public readonly eventName: string;
  public readonly eventId: string;
  public readonly eventVersion: number = 1;
  public readonly eventType: string = USER_EVENTS.USER_ONBOARDED_EVENT;
  public readonly occurredAt: string;
  public readonly payload: OnboardedIntegrationEventPayload;

  public constructor(config: {
    eventId: string;
    occuredAt: string;
    payload: OnboardedIntegrationEventPayload;
  }) {
    const { eventId, occuredAt, payload } = config;

    this.eventName = AGGREGATE_EVENT;
    this.eventId = eventId;
    this.occurredAt = occuredAt;
    this.payload = payload;
  }
}
