import { IntegrationEvent } from '@app/common/events';

export interface EventsPublisher {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  publishMessage(message: IntegrationEvent<any>): Promise<void>;
}

export const EVENT_PUBLISHER = Symbol('EVENT_PUBLISHER');
