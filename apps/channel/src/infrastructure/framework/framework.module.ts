import { Global, Module } from '@nestjs/common';

import {
  KAFKA_ACCESS_CERT,
  KAFKA_ACCESS_KEY,
  KAFKA_CA_CERT,
  KAFKA_CLIENT,
  KAFKA_CONSUMER,
  KAFKA_HOST,
  KAFKA_PORT,
  KafkaClient,
} from '@app/clients/kafka';
import {
  REDIS_CACHE_CONFIG,
  RedisCacheHandler,
  RedisCacheHandlerConfig,
} from '@app/handlers/cache-handler/redis';
import {
  DATABASE_CONFIG,
  DatabaseConfig,
  PrismaHandler,
} from '@app/handlers/database-handler/prisma';
import { LOGGER_PORT } from '@app/common/ports/logger';
import {
  KAFKA_EVENT_CONSUMER_CONFIG,
  KafkaEventConsumerHandler,
  KafkaEventConsumerHandlerConfig,
} from '@app/handlers/event-bus-handler/kafka/consumer-handler';
import {
  KAFKA_EVENT_PUBLISHER_HANDLER_CONFIG,
  KafkaEventPublisherHandler,
  KafkaEventPublisherHandlerConfig,
} from '@app/handlers/event-bus-handler/kafka/publisher-handler';
import { REDIS_HOST, REDIS_PORT, RedisClient } from '@app/clients/redis';
import { EVENT_CONSUMER, EVENT_PUBLISHER } from '@app/common/ports/events';
import { LOKI_URL, LokiConsoleLogger } from '@app/utils/loki-console-logger';
import { PRISMA_CLIENT, PRISMA_CLIENT_NAME, PrismaDBClient } from '@app/clients/prisma';
import {
  REDIS_BUFFER_HANDLER_CONFIG,
  RedisBufferHandlerConfig,
} from '@app/handlers/buffer-handler/redis';

import { CHANNEL_REPOSITORY, CHANNEL_STORAGE_PORT } from '@channel/application/ports';

import { PrismaClient } from '@persistance/channel';

import { AwsS3StorageAdapter } from '../storage/adapters';
import { ChannelRepositoryAdapter } from '../repository/adapters';
import { ChannelAggregatePersistanceACL } from '../anti-corruption';
import { ChannelConfigModule, ChannelConfigService } from '../config';
import { ChannelKafkaConsumerAdapter } from '../events/consumer/adapters';
import { ChannelKafkaPublisherAdapter } from '../events/publisher/adapters';

@Global()
@Module({
  imports: [ChannelConfigModule],
  providers: [
    ChannelConfigService,
    ChannelAggregatePersistanceACL,
    RedisCacheHandler,
    PrismaHandler,
    KafkaEventConsumerHandler,
    KafkaEventPublisherHandler,
    PrismaDBClient,
    KafkaClient,
    RedisClient,
    {
      provide: LOKI_URL,
      inject: [ChannelConfigService],
      useFactory: (configService: ChannelConfigService) => configService.GRAFANA_LOKI_URL,
    },
    {
      provide: DATABASE_CONFIG,
      inject: [ChannelConfigService],
      useFactory: (configService: ChannelConfigService) =>
        ({
          host: configService.DATABASE_URL,
          service: 'channel',
          logErrors: true,
          resilienceOptions: { maxRetries: 3, circuitBreakerThreshold: 10, halfOpenAfterMs: 1500 },
        }) satisfies DatabaseConfig,
    },
    {
      provide: REDIS_BUFFER_HANDLER_CONFIG,
      inject: [ChannelConfigService],
      useFactory: (configService: ChannelConfigService) =>
        ({
          host: configService.REDIS_HOST,
          port: configService.REDIS_PORT,
          service: 'channel',
          logErrors: true,
          resilienceOptions: { maxRetries: 3, circuitBreakerThreshold: 10, halfOpenAfterMs: 1500 },
        }) satisfies RedisBufferHandlerConfig,
    },
    {
      provide: REDIS_CACHE_CONFIG,
      inject: [ChannelConfigService],
      useFactory: (configService: ChannelConfigService) =>
        ({
          host: configService.REDIS_HOST,
          port: configService.REDIS_PORT,
          service: 'channel',
          logErrors: true,
          resilienceOptions: { maxRetries: 3, circuitBreakerThreshold: 10, halfOpenAfterMs: 1500 },
        }) satisfies RedisCacheHandlerConfig,
    },
    {
      provide: CHANNEL_REPOSITORY,
      useClass: ChannelRepositoryAdapter,
    },
    {
      provide: KAFKA_EVENT_CONSUMER_CONFIG,
      inject: [ChannelConfigService],
      useFactory: (configService: ChannelConfigService) =>
        ({
          host: configService.KAFKA_HOST,
          port: configService.KAFKA_PORT,
          service: 'channel',
          logErrors: true,
          resilienceOptions: {
            circuitBreakerThreshold: 50,
            halfOpenAfterMs: 10_000,
            maxRetries: 5,
          },
          enableDlq: true,
          dlqOnApplicationException: true,
          dlqOnDomainException: false,
          sendToDlqAfterAttempts: 5,
          dlqTopic: `dlq.channel`,
        }) satisfies KafkaEventConsumerHandlerConfig,
    },
    {
      provide: KAFKA_EVENT_PUBLISHER_HANDLER_CONFIG,
      inject: [ChannelConfigService],
      useFactory: (configService: ChannelConfigService) =>
        ({
          host: configService.KAFKA_HOST,
          port: configService.KAFKA_PORT,
          service: 'channel',
          logErrors: true,
          resilienceOptions: {
            circuitBreakerThreshold: 50,
            halfOpenAfterMs: 10_000,
            maxRetries: 5,
          },
          enableDlq: true,
          dlqOnApplicationException: true,
          dlqOnDomainException: false,
          sendToDlqAfterAttempts: 5,
          dlqTopic: `dlq.channel`,
        }) satisfies KafkaEventPublisherHandlerConfig,
    },
    { provide: EVENT_PUBLISHER, useClass: ChannelKafkaPublisherAdapter },
    { provide: EVENT_CONSUMER, useClass: ChannelKafkaConsumerAdapter },
    { provide: CHANNEL_STORAGE_PORT, useClass: AwsS3StorageAdapter },
    { provide: LOGGER_PORT, useClass: LokiConsoleLogger },
    {
      provide: KAFKA_HOST,
      inject: [ChannelConfigService],
      useFactory: (configService: ChannelConfigService) => configService.KAFKA_HOST,
    },
    {
      provide: KAFKA_PORT,
      inject: [ChannelConfigService],
      useFactory: (configService: ChannelConfigService) => configService.KAFKA_PORT,
    },
    {
      provide: KAFKA_CA_CERT,
      inject: [ChannelConfigService],
      useFactory: (configService: ChannelConfigService) => configService.KAFKA_CA_CERT,
    },
    {
      provide: KAFKA_ACCESS_CERT,
      inject: [ChannelConfigService],
      useFactory: (configService: ChannelConfigService) => configService.ACCESS_CERT,
    },
    {
      provide: KAFKA_ACCESS_KEY,
      inject: [ChannelConfigService],
      useFactory: (configService: ChannelConfigService) => configService.ACCESS_KEY,
    },
    {
      provide: KAFKA_CLIENT,
      inject: [ChannelConfigService],
      useFactory: (configService: ChannelConfigService) => configService.KAFKA_CLIENT_ID,
    },
    {
      provide: KAFKA_CONSUMER,
      inject: [ChannelConfigService],
      useFactory: (configService: ChannelConfigService) => configService.KAFKA_CONSUMER_ID,
    },
    {
      provide: REDIS_HOST,
      inject: [ChannelConfigService],
      useFactory: (configService: ChannelConfigService) => configService.REDIS_HOST,
    },
    {
      provide: REDIS_PORT,
      inject: [ChannelConfigService],
      useFactory: (configService: ChannelConfigService) => configService.REDIS_PORT,
    },
    {
      provide: PRISMA_CLIENT,
      useValue: PrismaClient,
    },
    {
      provide: PRISMA_CLIENT_NAME,
      useValue: 'channel',
    },
  ],
  exports: [
    ChannelConfigService,
    ChannelAggregatePersistanceACL,
    RedisCacheHandler,
    PrismaHandler,
    PrismaDBClient,
    KafkaEventPublisherHandler,
    KafkaEventConsumerHandler,
    KafkaClient,
    RedisClient,
    CHANNEL_REPOSITORY,
    CHANNEL_STORAGE_PORT,
    KAFKA_EVENT_CONSUMER_CONFIG,
    KAFKA_EVENT_PUBLISHER_HANDLER_CONFIG,
    EVENT_CONSUMER,
    EVENT_PUBLISHER,
    LOGGER_PORT,
    PRISMA_CLIENT,
    PRISMA_CLIENT_NAME,
    KAFKA_CLIENT,
    KAFKA_CONSUMER,
    KAFKA_CA_CERT,
    KAFKA_ACCESS_CERT,
    KAFKA_ACCESS_KEY,
    KAFKA_HOST,
    KAFKA_PORT,
    REDIS_HOST,
    REDIS_PORT,
  ],
})
export class FrameworkModule {}
