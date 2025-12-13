import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { USERS_EVENTS } from '@app/clients';
import { MESSAGE_BROKER } from '@app/ports/message-broker';
import { LOGGER_PORT, LoggerPort } from '@app/ports/logger';

import { KafkaMessageBrokerAdapter } from '@users/infrastructure/message-broker/adapters';

import { UserProfileUpdatedEvent } from './user-profile-updated.event';

@EventsHandler(UserProfileUpdatedEvent)
export class UserProfileUpdatedHandler implements IEventHandler<UserProfileUpdatedEvent> {
  public constructor(
    @Inject(LOGGER_PORT) private readonly logger: LoggerPort,
    @Inject(MESSAGE_BROKER)
    private readonly messageBroker: KafkaMessageBrokerAdapter,
  ) {}

  public async handle({ userUpdateProfileDto }: UserProfileUpdatedEvent) {
    const { updatedProfile } = userUpdateProfileDto;
    const { id } = updatedProfile;

    this.logger.info(
      `User with id:${id}, updated its profile to: ${JSON.stringify(updatedProfile)}`,
    );

    await this.messageBroker.publishMessage(
      USERS_EVENTS.USER_PROFILE_UPDATED_EVENT,
      JSON.stringify(updatedProfile),
    );
  }
}
