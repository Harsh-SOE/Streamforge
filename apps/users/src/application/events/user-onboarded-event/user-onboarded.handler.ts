import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { USERS_EVENTS } from '@app/clients';
import { LOGGER_PORT, LoggerPort } from '@app/ports/logger';
import { MESSAGE_BROKER, MessageBusPort } from '@app/ports/message-broker';

import { UserOnboardingEvent } from './user-onboarded.event';

@EventsHandler(UserOnboardingEvent)
export class UserProfileHandler implements IEventHandler<UserOnboardingEvent> {
  constructor(
    @Inject(LOGGER_PORT) private readonly logger: LoggerPort,
    @Inject(MESSAGE_BROKER) private readonly messageBroker: MessageBusPort,
  ) {}

  async handle({ userProfileCreatedEventDto }: UserOnboardingEvent) {
    const { email } = userProfileCreatedEventDto;

    this.logger.info(
      `User with email:${email}, created a profile: ${JSON.stringify(userProfileCreatedEventDto)}`,
    );

    await this.messageBroker.publishMessage(
      USERS_EVENTS.USER_ONBOARDED_EVENT,
      JSON.stringify(userProfileCreatedEventDto),
    );
  }
}
