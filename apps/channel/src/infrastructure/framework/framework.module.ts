import { Global, Module } from '@nestjs/common';

import { LOGGER_PORT } from '@app/ports/logger';
import { MESSAGE_BROKER } from '@app/ports/message-broker';
import { RedisCacheHandler } from '@app/handlers/cache-handler';
import { PrismaDatabaseHandler } from '@app/handlers/database-handler';
import { KafkaMessageBusHandler } from '@app/handlers/message-bus-handler';

import {
  KAFKA_CLIENT,
  KAFKA_CONSUMER,
  KAFKA_HOST,
  KAFKA_PORT,
  KafkaClient,
} from '@app/clients/kafka';
import {
  REDIS_HOST,
  REDIS_PORT,
  REDIS_STREAM_GROUPNAME,
  REDIS_STREAM_KEY,
  RedisClient,
} from '@app/clients/redis';
import { CHANNEL_REPOSITORY, CHANNEL_STORAGE_PORT } from '@channel/application/ports';

import { AppConfigModule, AppConfigService } from '../config';
import { WinstonLoggerAdapter } from '../logger';
import { AwsS3StorageAdapter } from '../storage/adapters';
import { KafkaMessageBrokerAdapter } from '../message-bus/adapters';
import { ChannelAggregatePersistanceACL } from '../anti-corruption';
import { ChannelRepositoryAdapter } from '../repository/adapters';
import { PRISMA_CLIENT, PRISMA_CLIENT_NAME, PrismaDBClient } from '@app/clients/prisma';

import { PrismaClient } from '@peristance/channel';

@Global()
@Module({
  imports: [AppConfigModule],
  providers: [
    AppConfigService,
    ChannelAggregatePersistanceACL,
    RedisCacheHandler,
    PrismaDatabaseHandler,
    KafkaMessageBusHandler,
    PrismaDBClient,
    KafkaClient,
    RedisClient,
    {
      provide: CHANNEL_REPOSITORY,
      useClass: ChannelRepositoryAdapter,
    },
    { provide: MESSAGE_BROKER, useClass: KafkaMessageBrokerAdapter },
    { provide: CHANNEL_STORAGE_PORT, useClass: AwsS3StorageAdapter },
    { provide: LOGGER_PORT, useClass: WinstonLoggerAdapter },
    {
      provide: KAFKA_HOST,
      inject: [AppConfigService],
      useFactory: (configService: AppConfigService) => configService.KAFKA_HOST,
    },
    {
      provide: KAFKA_PORT,
      inject: [AppConfigService],
      useFactory: (configService: AppConfigService) => configService.KAFKA_PORT,
    },
    {
      provide: KAFKA_CLIENT,
      inject: [AppConfigService],
      useFactory: (configService: AppConfigService) => configService.KAFKA_CLIENT_ID,
    },
    {
      provide: KAFKA_CONSUMER,
      inject: [AppConfigService],
      useFactory: (configService: AppConfigService) => configService.KAFKA_CONSUMER_ID,
    },
    {
      provide: REDIS_HOST,
      inject: [AppConfigService],
      useFactory: (configService: AppConfigService) => configService.REDIS_HOST,
    },
    {
      provide: REDIS_PORT,
      inject: [AppConfigService],
      useFactory: (configService: AppConfigService) => configService.REDIS_PORT,
    },
    {
      provide: REDIS_STREAM_KEY,
      inject: [AppConfigService],
      useFactory: (configService: AppConfigService) => configService.REDIS_STREAM_KEY,
    },
    {
      provide: REDIS_STREAM_GROUPNAME,
      inject: [AppConfigService],
      useFactory: (configService: AppConfigService) => configService.REDIS_STREAM_GROUPNAME,
    },
    {
      provide: PRISMA_CLIENT,
      useValue: PrismaClient,
    },
    {
      provide: PRISMA_CLIENT_NAME,
      useValue: 'users',
    },
  ],
  exports: [
    AppConfigService,
    ChannelAggregatePersistanceACL,
    RedisCacheHandler,
    PrismaDatabaseHandler,
    KafkaMessageBusHandler,
    PrismaDBClient,
    KafkaClient,
    RedisClient,
    CHANNEL_REPOSITORY,
    MESSAGE_BROKER,
    CHANNEL_STORAGE_PORT,
    LOGGER_PORT,
  ],
})
export class FrameworkModule {}
