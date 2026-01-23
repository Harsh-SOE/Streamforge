import { v4 as uuidv4 } from 'uuid';

import { IntegrationEvent, PROJECTION_EVENT } from '@app/common/events';

import { PROJECTION_EVENTS } from './event-types';

export interface UserUpdatedProjectionEventPayload {
  userId: string;
  avatar?: string;
  dob?: string;
  phoneNumber?: string;
}

export class UserUpdatedProjectionEvent implements IntegrationEvent<UserUpdatedProjectionEventPayload> {
  public readonly eventVersion: number = 1;
  public readonly eventId: string = uuidv4();
  public readonly eventName: string = PROJECTION_EVENT;
  public readonly occurredAt: string = new Date().toISOString();
  public readonly eventType: string = PROJECTION_EVENTS.USER_PROFILE_UPDATED_PROJECTION_EVENT;
  public readonly payload: UserUpdatedProjectionEventPayload;

  public constructor(payload: UserUpdatedProjectionEventPayload) {
    this.payload = payload;
  }
}
