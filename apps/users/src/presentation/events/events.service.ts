// add subscription logic

import { Inject, Injectable } from '@nestjs/common';
import { IntegrationEvent } from '@app/common/events';

import { LOGGER_PORT, LoggerPort } from '@app/common/ports/logger';

@Injectable()
export class EventsService {
  public constructor(@Inject(LOGGER_PORT) private readonly logger: LoggerPort) {}

  public async OnUserOnboardedEvent(event: IntegrationEvent<any>) {
    await new Promise((resolve) => {
      setTimeout(resolve, 1000);
    });
    this.logger.info(`Recieved user onboarded event`, event);
  }
}
