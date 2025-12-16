import { Global, Module } from '@nestjs/common';
import { LOGGER_PORT } from '@app/ports/logger';
import { MESSAGE_BROKER } from '@app/ports/message-broker';
import { PrismaDatabaseHandler } from '@app/handlers/database-handler';
import { KafkaMessageBrokerHandler } from '@app/handlers/message-broker-handler';

import { CHANNEL_REPOSITORY, CHANNEL_STORAGE_PORT } from '@channel/application/ports';

import { AppConfigModule, AppConfigService } from '../config';
import { WinstonLoggerAdapter } from '../logger';
import { AwsS3StorageAdapter } from '../storage/adapters';
import { KafkaMessageBrokerAdapter } from '../message-bus/adapters';
import { ChannelAggregatePersistanceACL } from '../anti-corruption';
import { ChannelRepositoryAdapter } from '../repository/adapters';

@Global()
@Module({
  imports: [AppConfigModule],
  providers: [
    AppConfigService,
    KafkaMessageBrokerHandler,
    ChannelAggregatePersistanceACL,
    PrismaDatabaseHandler,
    {
      provide: CHANNEL_REPOSITORY,
      useClass: ChannelRepositoryAdapter,
    },
    { provide: MESSAGE_BROKER, useClass: KafkaMessageBrokerAdapter },
    { provide: CHANNEL_STORAGE_PORT, useClass: AwsS3StorageAdapter },
    { provide: LOGGER_PORT, useClass: WinstonLoggerAdapter },
  ],
  exports: [
    AppConfigService,
    KafkaMessageBrokerHandler,
    ChannelAggregatePersistanceACL,
    PrismaDatabaseHandler,
    ChannelRepositoryAdapter,
    KafkaMessageBrokerAdapter,
    AwsS3StorageAdapter,
    WinstonLoggerAdapter,
  ],
})
export class FrameworkModule {}
