import { IntegrationEvent } from '@app/common/events';

export interface EventsConsumer {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  consumeMessage(
    onConsumeMessageHandler: (message: IntegrationEvent<any>) => Promise<void>,
  ): Promise<void>;
}

export const EVENT_CONSUMER = Symbol('EVENT_CONSUMER');
