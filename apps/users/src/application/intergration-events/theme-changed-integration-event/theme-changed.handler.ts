import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { LOGGER_PORT, LoggerPort } from '@app/common/ports/logger';
import { EVENT_PUBLISHER, EventsPublisher } from '@app/common/ports/events';

import { ThemeChangedDomainEvent } from '@users/domain/domain-events';

import { ThemeChangedIntegrationEvent } from './theme-changed.integration-event';

@EventsHandler(ThemeChangedDomainEvent)
export class ThemeChangedHandler implements IEventHandler<ThemeChangedDomainEvent> {
  public constructor(
    @Inject(LOGGER_PORT) private readonly logger: LoggerPort,
    @Inject(EVENT_PUBLISHER)
    private readonly messageBroker: EventsPublisher,
  ) {}

  public async handle(themeChangedDomainEvent: ThemeChangedDomainEvent) {
    this.logger.info(
      `User with id:${themeChangedDomainEvent.userId} chaanged its theme to ${themeChangedDomainEvent.theme}`,
    );

    const themeChangedIntegrationEvent = new ThemeChangedIntegrationEvent(themeChangedDomainEvent);

    await this.messageBroker.publishMessage(themeChangedIntegrationEvent);
  }
}
