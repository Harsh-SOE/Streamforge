import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { LOGGER_PORT, LoggerPort } from '@app/common/ports/logger';
import { EVENT_PUBLISHER_PORT, EventsPublisherPort } from '@app/common/ports/events';

import { OnboardedDomainEvent } from '@users/domain/domain-events';

import { OnboardedIntegrationEvent } from './onboarded.integration-event';

@EventsHandler(OnboardedDomainEvent)
export class UserProfileHandler implements IEventHandler<OnboardedDomainEvent> {
  constructor(
    @Inject(LOGGER_PORT) private readonly logger: LoggerPort,
    @Inject(EVENT_PUBLISHER_PORT) private readonly eventPublisher: EventsPublisherPort,
  ) {}

  async handle(onboardedDomainEvent: OnboardedDomainEvent) {
    this.logger.info(
      `User with email:${onboardedDomainEvent.email}, created a profile: ${JSON.stringify(onboardedDomainEvent)}`,
    );

    const onboardedIntegrationEvent = new OnboardedIntegrationEvent(onboardedDomainEvent);

    await this.eventPublisher.publishMessage(onboardedIntegrationEvent);
  }
}
