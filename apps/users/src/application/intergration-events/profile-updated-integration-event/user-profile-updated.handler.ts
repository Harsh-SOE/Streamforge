import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { LOGGER_PORT, LoggerPort } from '@app/common/ports/logger';
import { EVENT_PUBLISHER, EventsPublisher } from '@app/common/ports/events';

import { ProfileUpdatedDomainEvent } from '@users/domain/domain-events';

import { ProfileUpdatedIntegrationEvent } from './user-profile-updated.integration-event';

@EventsHandler(ProfileUpdatedDomainEvent)
export class UserProfileUpdatedHandler implements IEventHandler<ProfileUpdatedDomainEvent> {
  public constructor(
    @Inject(LOGGER_PORT) private readonly logger: LoggerPort,
    @Inject(EVENT_PUBLISHER)
    private readonly eventPublisher: EventsPublisher,
  ) {}

  public async handle(profileUpdatedDomainEvent: ProfileUpdatedDomainEvent) {
    this.logger.info(
      `User with id:${profileUpdatedDomainEvent.userId}, updated its profile to: ${JSON.stringify(profileUpdatedDomainEvent)}`,
    );

    const profileUpdatedIntegrationEvent = new ProfileUpdatedIntegrationEvent(
      profileUpdatedDomainEvent,
    );

    await this.eventPublisher.publishMessage(profileUpdatedIntegrationEvent);
  }
}
