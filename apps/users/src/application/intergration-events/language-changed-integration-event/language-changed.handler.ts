import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { LOGGER_PORT, LoggerPort } from '@app/common/ports/logger';
import { EVENT_PUBLISHER, EventsPublisher } from '@app/common/ports/events';

import { LanguageChangedDomainEvent } from '@users/domain/domain-events';

import { LanguageChangedIntergrationEvent } from './language-changed.integration-event';

@EventsHandler(LanguageChangedDomainEvent)
export class LanguageChangedHandler implements IEventHandler<LanguageChangedDomainEvent> {
  public constructor(
    @Inject(LOGGER_PORT) private readonly logger: LoggerPort,
    @Inject(EVENT_PUBLISHER)
    private readonly publisher: EventsPublisher,
  ) {}

  public async handle(languageChangedDomainEvent: LanguageChangedDomainEvent) {
    this.logger.info(
      `User with id:${languageChangedDomainEvent.userId} changed its language to '${languageChangedDomainEvent.language}'`,
    );

    const userLanguageChangedIntegrationEvent = new LanguageChangedIntergrationEvent(
      languageChangedDomainEvent,
    );

    await this.publisher.publishMessage(userLanguageChangedIntegrationEvent);
  }
}
