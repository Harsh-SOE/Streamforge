import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { USERS_EVENTS } from '@app/clients';
import { MESSAGE_BROKER } from '@app/ports/message-broker';
import { LOGGER_PORT, LoggerPort } from '@app/ports/logger';

import { KafkaMessageBusAdapter } from '@users/infrastructure/message-bus/adapters';

import { UserNotificationStatusChangedEvent } from './user-notification-status-changed.event';

@EventsHandler(UserNotificationStatusChangedEvent)
export class UserNotificationStatusChangedHandler implements IEventHandler<UserNotificationStatusChangedEvent> {
  public constructor(
    @Inject(LOGGER_PORT) private readonly logger: LoggerPort,
    @Inject(MESSAGE_BROKER)
    private readonly messageBroker: KafkaMessageBusAdapter,
  ) {}

  public async handle({ userNotificationChangedEventDto }: UserNotificationStatusChangedEvent) {
    const { id, status } = userNotificationChangedEventDto;
    this.logger.info(`User with id:${id} turned ${status ? 'on' : 'off'} its notification status`);

    await this.messageBroker.publishMessage(
      USERS_EVENTS.USER_NOTIFICATION_CHANGED_EVENT,
      JSON.stringify(userNotificationChangedEventDto),
    );
  }
}
