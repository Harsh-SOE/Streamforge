import { CqrsModule } from '@nestjs/cqrs';
import { Global, Module } from '@nestjs/common';

import { REDIS_HOST, REDIS_PORT, RedisClient } from '@app/clients/redis';
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
import { EVENT_CONSUMER, EVENT_PUBLISHER } from '@app/common/ports/events';
import { LOKI_URL, LokiConsoleLogger } from '@app/utils/loki-console-logger';
import { PRISMA_CLIENT, PRISMA_CLIENT_NAME, PrismaDBClient } from '@app/clients/prisma';
import {
  DATABASE_CONFIG,
  DatabaseConfig,
  PrismaHandler,
} from '@app/handlers/database-handler/prisma';

import {
  VIEWS_BUFFER_PORT,
  VIEWS_CACHE_PORT,
  VIEWS_REPOSITORY_PORT,
} from '@views/application/ports';

import { PrismaClient as ViewPrismaClient } from '@persistance/views';

import { MeasureModule } from '../measure';
import { ViewCacheAdapter } from '../cache/adapters';
import { ViewRepositoryAdapter } from '../repository/adapters';
import { ViewPeristanceAggregateACL } from '../anti-corruption';
import { ViewsConfigModule, ViewsConfigService } from '../config';
import { ViewsKafkaConsumerAdapter } from '../events-bus/consumer/adapters';
import { ViewsKafkaPublisherAdapter } from '../events-bus/publisher/adapters';
import { REDIS_STREAM_CONFIG, RedisStreamBufferAdapter, StreamConfig } from '../buffer/adapters';

@Global()
@Module({
  imports: [MeasureModule, CqrsModule, ViewsConfigModule],
  providers: [
    KafkaClient,

    {
      provide: EVENT_PUBLISHER,
      useClass: ViewsKafkaPublisherAdapter,
    },
    {
      provide: KAFKA_EVENT_PUBLISHER_HANDLER_CONFIG,
      inject: [ViewsConfigService],
      useFactory: (configService: ViewsConfigService) =>
        ({
          host: configService.KAFKA_HOST,
          port: configService.KAFKA_PORT,
          service: 'views',
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
          dlqTopic: `dlq.views`,
        }) satisfies KafkaEventPublisherHandlerConfig,
    },
    KafkaEventPublisherHandler,

    {
      provide: EVENT_CONSUMER,
      useClass: ViewsKafkaConsumerAdapter,
    },
    {
      provide: KAFKA_EVENT_CONSUMER_CONFIG,
      inject: [ViewsConfigService],
      useFactory: (configService: ViewsConfigService) =>
        ({
          host: configService.KAFKA_HOST,
          port: configService.KAFKA_PORT,
          service: 'views',
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
          dlqTopic: `dlq.views`,
        }) satisfies KafkaEventConsumerHandlerConfig,
    },
    KafkaEventConsumerHandler,

    RedisClient,
    { provide: VIEWS_BUFFER_PORT, useClass: RedisStreamBufferAdapter },
    {
      provide: REDIS_STREAM_CONFIG,
      inject: [ViewsConfigService],
      useFactory: (configService: ViewsConfigService) =>
        ({
          key: configService.REDIS_STREAM_KEY,
          groupName: configService.REDIS_STREAM_GROUPNAME,
        }) satisfies StreamConfig,
    },
    {
      provide: REDIS_BUFFER_HANDLER_CONFIG,
      inject: [ViewsConfigService],
      useFactory: (configService: ViewsConfigService) =>
        ({
          host: configService.REDIS_HOST,
          port: configService.REDIS_PORT,
          service: 'views',
          logErrors: true,
          resilienceOptions: { maxRetries: 3, circuitBreakerThreshold: 10, halfOpenAfterMs: 1500 },
        }) satisfies RedisBufferHandlerConfig,
    },
    RedisBufferHandler,

    { provide: VIEWS_CACHE_PORT, useClass: ViewCacheAdapter },
    {
      provide: REDIS_CACHE_CONFIG,
      inject: [ViewsConfigService],
      useFactory: (configService: ViewsConfigService) =>
        ({
          host: configService.REDIS_HOST,
          port: configService.REDIS_PORT,
          service: 'views',
          logErrors: true,
          resilienceOptions: { maxRetries: 3, circuitBreakerThreshold: 10, halfOpenAfterMs: 1500 },
        }) satisfies RedisCacheHandlerConfig,
    },
    RedisCacheHandler,

    PrismaDBClient,
    { provide: VIEWS_REPOSITORY_PORT, useClass: ViewRepositoryAdapter },
    {
      provide: DATABASE_CONFIG,
      inject: [ViewsConfigService],
      useFactory: (configService: ViewsConfigService) =>
        ({
          host: configService.DATABASE_URL,
          service: 'views',
          logErrors: true,
          resilienceOptions: { maxRetries: 3, circuitBreakerThreshold: 10, halfOpenAfterMs: 1500 },
        }) satisfies DatabaseConfig,
    },
    PrismaHandler,

    { provide: LOGGER_PORT, useClass: LokiConsoleLogger },
    {
      provide: LOKI_URL,
      inject: [ViewsConfigService],
      useFactory: (configService: ViewsConfigService) => configService.GRAFANA_LOKI_URL,
    },

    ViewsConfigService,
    ViewPeristanceAggregateACL,

    {
      provide: KAFKA_HOST,
      inject: [ViewsConfigService],
      useFactory: (configService: ViewsConfigService) => configService.KAFKA_HOST,
    },
    {
      provide: KAFKA_PORT,
      inject: [ViewsConfigService],
      useFactory: (configService: ViewsConfigService) => configService.KAFKA_PORT,
    },
    {
      provide: KAFKA_CLIENT,
      inject: [ViewsConfigService],
      useFactory: (configService: ViewsConfigService) => configService.KAFKA_CLIENT_ID,
    },
    {
      provide: KAFKA_CA_CERT,
      inject: [ViewsConfigService],
      useFactory: (configService: ViewsConfigService) => configService.KAFKA_CA_CERT,
    },
    {
      provide: KAFKA_ACCESS_CERT,
      inject: [ViewsConfigService],
      useFactory: (configService: ViewsConfigService) => configService.ACCESS_CERT,
    },
    {
      provide: KAFKA_ACCESS_KEY,
      inject: [ViewsConfigService],
      useFactory: (configService: ViewsConfigService) => configService.ACCESS_KEY,
    },
    {
      provide: KAFKA_CONSUMER,
      inject: [ViewsConfigService],
      useFactory: (configService: ViewsConfigService) => configService.KAFKA_CONSUMER_ID,
    },

    {
      provide: REDIS_HOST,
      inject: [ViewsConfigService],
      useFactory: (configService: ViewsConfigService) => configService.REDIS_HOST,
    },
    {
      provide: REDIS_PORT,
      inject: [ViewsConfigService],
      useFactory: (configService: ViewsConfigService) => configService.REDIS_PORT,
    },
    {
      provide: PRISMA_CLIENT,
      useValue: ViewPrismaClient,
    },
    {
      provide: PRISMA_CLIENT_NAME,
      useValue: 'views',
    },
  ],
  exports: [
    MeasureModule,
    CqrsModule,
    ViewPeristanceAggregateACL,

    PrismaHandler,
    RedisCacheHandler,

    KafkaClient,
    RedisClient,
    PrismaDBClient,

    EVENT_PUBLISHER,
    KAFKA_EVENT_PUBLISHER_HANDLER_CONFIG,
    ViewsKafkaPublisherAdapter,
    KafkaEventPublisherHandler,

    EVENT_CONSUMER,
    KAFKA_EVENT_CONSUMER_CONFIG,
    ViewsKafkaConsumerAdapter,
    KafkaEventConsumerHandler,

    VIEWS_CACHE_PORT,
    VIEWS_REPOSITORY_PORT,
    VIEWS_BUFFER_PORT,
    LOGGER_PORT,
    PRISMA_CLIENT,
    PRISMA_CLIENT_NAME,
    KAFKA_CLIENT,
    KAFKA_CONSUMER,
    KAFKA_HOST,
    KAFKA_PORT,
    KAFKA_ACCESS_CERT,
    KAFKA_ACCESS_KEY,
    KAFKA_CA_CERT,
    REDIS_HOST,
    REDIS_PORT,
    RedisClient,
  ],
})
export class FrameworkModule {}
