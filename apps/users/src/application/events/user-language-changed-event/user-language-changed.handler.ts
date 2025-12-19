import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { USERS_EVENTS } from '@app/clients';
import { MESSAGE_BROKER } from '@app/ports/message-broker';
import { LOGGER_PORT, LoggerPort } from '@app/ports/logger';

import { KafkaMessageBrokerAdapter } from '@users/infrastructure/message-bus/adapters';

import { UserLanguageChangedEvent } from './user-language-changed.event';

@EventsHandler(UserLanguageChangedEvent)
export class UserLanguageChangedHandler implements IEventHandler<UserLanguageChangedEvent> {
  public constructor(
    @Inject(LOGGER_PORT) private readonly logger: LoggerPort,
    @Inject(MESSAGE_BROKER)
    private readonly messageBroker: KafkaMessageBrokerAdapter,
  ) {}

  public async handle({ userLanguageChangedEventDto }: UserLanguageChangedEvent) {
    const { id, language } = userLanguageChangedEventDto;

    this.logger.info(`User with id:${id} changed its language to '${language}'`);

    await this.messageBroker.publishMessage(
      USERS_EVENTS.USER_LANGUAGE_CHANGED_EVENT,
      JSON.stringify(userLanguageChangedEventDto),
    );
  }
}
