import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { USERS_EVENTS } from '@app/clients';
import { LOGGER_PORT, LoggerPort } from '@app/ports/logger';
import { MESSAGE_BROKER, MessageBrokerPort } from '@app/ports/message-broker';
import { UserProfileCreatedEventDto } from '@app/contracts/users';

import { CreateProfileEvent } from './create-profile.event';

@EventsHandler(CreateProfileEvent)
export class CompleteProfileEventHandler implements IEventHandler<CreateProfileEvent> {
  constructor(
    @Inject(MESSAGE_BROKER) private readonly messageBroker: MessageBrokerPort,
    @Inject(LOGGER_PORT) private readonly logger: LoggerPort,
  ) {}

  async handle({ user }: CreateProfileEvent) {
    const userPayload = user.getUserSnapshot();
    const { id, handle, email, avatar, userAuthId } = userPayload;

    const userProfileCreatedEventDto: UserProfileCreatedEventDto = {
      id,
      userAuthId,
      email,
      handle,
      avatar,
    };

    await this.messageBroker.publishMessage(
      USERS_EVENTS.USER_ONBOARDED_EVENT,
      JSON.stringify(userProfileCreatedEventDto),
    );

    this.logger.info(
      `User with email:${email}, created a profile: ${JSON.stringify(user)}`,
    );
  }
}
