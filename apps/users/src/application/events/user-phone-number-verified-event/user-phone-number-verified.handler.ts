import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { USERS_EVENTS } from '@app/clients';
import { MESSAGE_BROKER } from '@app/ports/message-broker';
import { LOGGER_PORT, LoggerPort } from '@app/ports/logger';

import { KafkaMessageBrokerAdapter } from '@users/infrastructure/message-broker/adapters';

import { UserPhoneNumberVerifiedEvent } from './user-phone-number-verified.event';

@EventsHandler(UserPhoneNumberVerifiedEvent)
export class UserPhoneNumberVerfiedHandler implements IEventHandler<UserPhoneNumberVerifiedEvent> {
  public constructor(
    @Inject(LOGGER_PORT) private readonly logger: LoggerPort,
    @Inject(MESSAGE_BROKER)
    private readonly messageBroker: KafkaMessageBrokerAdapter,
  ) {}

  public async handle({ userPhoneNumberEventDto }: UserPhoneNumberVerifiedEvent) {
    const { id, phoneNumber } = userPhoneNumberEventDto;
    this.logger.info(`Phone number: ${phoneNumber} for verified for user with id:${id}.`);

    await this.messageBroker.publishMessage(
      USERS_EVENTS.USER_PHONE_NUMBER_UPDATED_EVENT,
      JSON.stringify(userPhoneNumberEventDto),
    );
  }
}
