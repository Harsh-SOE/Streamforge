import { CqrsModule } from '@nestjs/cqrs';
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
  REDIS_BUFFER_HANDLER_CONFIG,
  RedisBufferHandler,
  RedisBufferHandlerConfig,
} from '@app/handlers/buffer-handler/redis';
import {
  DATABASE_CONFIG,
  DatabaseConfig,
  PrismaHandler,
} from '@app/handlers/database-handler/prisma';
import { LOGGER_PORT } from '@app/common/ports/logger';
import { REDIS_HOST, REDIS_PORT, RedisClient } from '@app/clients/redis';
import { EVENT_CONSUMER, EVENT_PUBLISHER } from '@app/common/ports/events';
import { LOKI_URL, LokiConsoleLogger } from '@app/utils/loki-console-logger';
import { PRISMA_CLIENT, PRISMA_CLIENT_NAME, PrismaDBClient } from '@app/clients/prisma';
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

import {
  REACTION_BUFFER_PORT,
  REACTION_CACHE_PORT,
  REACTION_DATABASE_PORT,
} from '@reaction/application/ports';

import { PrismaClient as ReactionPrismaClient } from '@persistance/reaction';

import { MeasureModule } from '../measure';
import { ReactionConfigService } from '../config';
import { RedisCacheAdapter } from '../cache/adapters';
import { REDIS_STREAM_CONFIG, RedisStreamBufferAdapter, StreamConfig } from '../buffer/adapters';
import { ReactionRepositoryAdapter } from '../repository/adapters';
import { ReactionAggregatePersistanceACL } from '../anti-corruption';
import { ReactionKafkaPublisherAdapter } from '../events-bus/publisher/adapters';
import { ReactionKafkaConsumerAdapter } from '../events-bus/consumer/adapters';

@Global()
@Module({
  imports: [MeasureModule, CqrsModule],
  providers: [
    ReactionConfigService,
    ReactionAggregatePersistanceACL,
    RedisBufferHandler,
    RedisCacheHandler,
    KafkaEventConsumerHandler,
    KafkaEventPublisherHandler,
    PrismaHandler,
    KafkaClient,
    RedisClient,
    PrismaDBClient,
    {
      provide: LOKI_URL,
      inject: [ReactionConfigService],
      useFactory: (configService: ReactionConfigService) => configService.GRAFANA_LOKI_URL,
    },
    {
      provide: DATABASE_CONFIG,
      inject: [ReactionConfigService],
      useFactory: (configService: ReactionConfigService) =>
        ({
          host: configService.DATABASE_URL,
          service: 'reaction',
          logErrors: true,
          resilienceOptions: { maxRetries: 3, circuitBreakerThreshold: 10, halfOpenAfterMs: 1500 },
        }) satisfies DatabaseConfig,
    },
    {
      provide: REDIS_BUFFER_HANDLER_CONFIG,
      inject: [ReactionConfigService],
      useFactory: (configService: ReactionConfigService) =>
        ({
          host: configService.REDIS_HOST,
          port: configService.REDIS_PORT,
          service: 'reaction',
          logErrors: true,
          resilienceOptions: { maxRetries: 3, circuitBreakerThreshold: 10, halfOpenAfterMs: 1500 },
        }) satisfies RedisBufferHandlerConfig,
    },
    {
      provide: REDIS_STREAM_CONFIG,
      inject: [ReactionConfigService],
      useFactory: (configService: ReactionConfigService) =>
        ({
          key: configService.REDIS_STREAM_KEY,
          groupName: configService.REDIS_STREAM_GROUPNAME,
        }) satisfies StreamConfig,
    },
    {
      provide: REDIS_CACHE_CONFIG,
      inject: [ReactionConfigService],
      useFactory: (configService: ReactionConfigService) =>
        ({
          host: configService.REDIS_HOST,
          port: configService.REDIS_PORT,
          service: 'reaction',
          logErrors: true,
          resilienceOptions: { maxRetries: 3, circuitBreakerThreshold: 10, halfOpenAfterMs: 1500 },
        }) satisfies RedisCacheHandlerConfig,
    },
    {
      provide: KAFKA_EVENT_CONSUMER_CONFIG,
      inject: [ReactionConfigService],
      useFactory: (configService: ReactionConfigService) =>
        ({
          host: configService.KAFKA_HOST,
          port: configService.KAFKA_PORT,
          service: 'users',
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
          dlqTopic: `dlq.users`,
        }) satisfies KafkaEventConsumerHandlerConfig,
    },
    {
      provide: KAFKA_EVENT_PUBLISHER_HANDLER_CONFIG,
      inject: [ReactionConfigService],
      useFactory: (configService: ReactionConfigService) =>
        ({
          host: configService.KAFKA_HOST,
          port: configService.KAFKA_PORT,
          service: 'users',
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
          dlqTopic: `dlq.users`,
        }) satisfies KafkaEventPublisherHandlerConfig,
    },
    { provide: REACTION_DATABASE_PORT, useClass: ReactionRepositoryAdapter },
    { provide: REACTION_CACHE_PORT, useClass: RedisCacheAdapter },
    { provide: EVENT_PUBLISHER, useClass: ReactionKafkaPublisherAdapter },
    { provide: EVENT_CONSUMER, useClass: ReactionKafkaConsumerAdapter },
    { provide: REACTION_BUFFER_PORT, useClass: RedisStreamBufferAdapter },
    { provide: LOGGER_PORT, useClass: LokiConsoleLogger },
    {
      provide: KAFKA_HOST,
      inject: [ReactionConfigService],
      useFactory: (configService: ReactionConfigService) => configService.KAFKA_HOST,
    },
    {
      provide: KAFKA_PORT,
      inject: [ReactionConfigService],
      useFactory: (configService: ReactionConfigService) => configService.KAFKA_PORT,
    },
    {
      provide: KAFKA_CLIENT,
      inject: [ReactionConfigService],
      useFactory: (configService: ReactionConfigService) => configService.KAFKA_CLIENT_ID,
    },
    {
      provide: KAFKA_CA_CERT,
      inject: [ReactionConfigService],
      useFactory: (configService: ReactionConfigService) => configService.KAFKA_CA_CERT,
    },
    {
      provide: KAFKA_ACCESS_CERT,
      inject: [ReactionConfigService],
      useFactory: (configService: ReactionConfigService) => configService.ACCESS_CERT,
    },
    {
      provide: KAFKA_ACCESS_KEY,
      inject: [ReactionConfigService],
      useFactory: (configService: ReactionConfigService) => configService.ACCESS_KEY,
    },
    {
      provide: KAFKA_CONSUMER,
      inject: [ReactionConfigService],
      useFactory: (configService: ReactionConfigService) => configService.KAFKA_CONSUMER_ID,
    },
    {
      provide: REDIS_HOST,
      inject: [ReactionConfigService],
      useFactory: (configService: ReactionConfigService) => configService.REDIS_HOST,
    },
    {
      provide: REDIS_PORT,
      inject: [ReactionConfigService],
      useFactory: (configService: ReactionConfigService) => configService.REDIS_PORT,
    },
    {
      provide: PRISMA_CLIENT,
      useValue: ReactionPrismaClient,
    },
    {
      provide: PRISMA_CLIENT_NAME,
      useValue: 'reaction',
    },
  ],
  exports: [
    MeasureModule,
    CqrsModule,
    ReactionAggregatePersistanceACL,

    PrismaHandler,
    RedisBufferHandler,
    RedisCacheHandler,
    KafkaEventConsumerHandler,
    KafkaEventPublisherHandler,

    KafkaClient,
    RedisClient,
    PrismaDBClient,

    REACTION_DATABASE_PORT,
    KAFKA_EVENT_CONSUMER_CONFIG,
    KAFKA_EVENT_PUBLISHER_HANDLER_CONFIG,
    REDIS_BUFFER_HANDLER_CONFIG,
    EVENT_PUBLISHER,
    EVENT_CONSUMER,
    LOGGER_PORT,
    REACTION_BUFFER_PORT,
    REACTION_CACHE_PORT,
    PRISMA_CLIENT,
    PRISMA_CLIENT_NAME,
    KAFKA_CLIENT,
    KAFKA_CONSUMER,
    KAFKA_HOST,
    KAFKA_PORT,
    KAFKA_ACCESS_CERT,
    KAFKA_CA_CERT,
    KAFKA_ACCESS_KEY,
    REDIS_HOST,
    REDIS_PORT,
  ],
})
export class FrameworkModule {}
