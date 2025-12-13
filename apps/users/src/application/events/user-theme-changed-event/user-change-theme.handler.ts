import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { USERS_EVENTS } from '@app/clients';
import { MESSAGE_BROKER } from '@app/ports/message-broker';
import { LOGGER_PORT, LoggerPort } from '@app/ports/logger';

import { KafkaMessageBrokerAdapter } from '@users/infrastructure/message-broker/adapters';

import { UserThemeChangedEvent } from './user-change-theme.event';

@EventsHandler(UserThemeChangedEvent)
export class UserThemeChangedHandler implements IEventHandler<UserThemeChangedEvent> {
  public constructor(
    @Inject(LOGGER_PORT) private readonly logger: LoggerPort,
    @Inject(MESSAGE_BROKER)
    private readonly messageBroker: KafkaMessageBrokerAdapter,
  ) {}

  public async handle({ userThemeChangedEventDto }: UserThemeChangedEvent) {
    const { id, theme } = userThemeChangedEventDto;

    this.logger.info(`User with id:${id} chaanged its theme to ${theme}`);

    await this.messageBroker.publishMessage(
      USERS_EVENTS.USER_THEME_CHANGED_EVENT,
      JSON.stringify(userThemeChangedEventDto),
    );
  }
}
