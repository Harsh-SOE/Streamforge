import { Inject, Injectable } from '@nestjs/common';

import { LOGGER_PORT, LoggerPort } from '@app/common/ports/logger';
import { ChannelCreatedProjectionEvent } from '@app/common/events/projections';

import {
  CHANNEL_PROJECTION_REPOSITORY_PORT,
  ChannelProjectionRepositoryPort,
} from '@read/application/ports';

@Injectable()
export class ChannelEventsService {
  public constructor(
    @Inject(CHANNEL_PROJECTION_REPOSITORY_PORT)
    private readonly channelProjectionRespository: ChannelProjectionRepositoryPort,
    @Inject(LOGGER_PORT) private readonly logger: LoggerPort,
  ) {}

  public async onChannelCreated(channelCreatedIntegrationEvent: ChannelCreatedProjectionEvent) {
    this.logger.info(`saving user projection`);
    await this.channelProjectionRespository.saveChannel(channelCreatedIntegrationEvent.payload);
  }
}
