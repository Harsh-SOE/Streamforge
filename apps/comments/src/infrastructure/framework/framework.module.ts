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
import { MESSAGE_BROKER } from '@app/common/ports/message-broker';
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
  COMMENTS_BUFFER_PORT,
  COMMENTS_CACHE_PORT,
  COMMENTS_REPOSITORY_PORT,
} from '@comments/application/ports';

import {
  COMMENTS_REDIS_STREAM_CONFIG,
  RedisStreamBufferAdapter,
  StreamConfig,
} from '../buffer/adapters';
import { MeasureModule } from '../measure';
import { CommentsConfigService } from '../config';
import { RedisCacheAdapter } from '../cache/adapters';
import { CommentAggregatePersistance } from '../anti-corruption';
import { PrismaMongoDBRepositoryAdapter } from '../repository/adapters';

import { PrismaClient as CommentsPrismaClient } from '@persistance/comments';

@Global()
@Module({
  imports: [MeasureModule, CqrsModule],
  providers: [
    CommentsConfigService,
    RedisBufferHandler,
    RedisCacheHandler,
    KafkaEventPublisherHandler,
    KafkaEventConsumerHandler,
    PrismaHandler,
    CommentAggregatePersistance,
    KafkaClient,
    RedisClient,
    PrismaDBClient,
    {
      provide: LOKI_URL,
      inject: [CommentsConfigService],
      useFactory: (configService: CommentsConfigService) => configService.GRAFANA_LOKI_URL,
    },
    {
      provide: DATABASE_CONFIG,
      inject: [CommentsConfigService],
      useFactory: (configService: CommentsConfigService) =>
        ({
          host: configService.DATABASE_URL,
          service: 'comments',
          logErrors: true,
          resilienceOptions: { maxRetries: 3, circuitBreakerThreshold: 10, halfOpenAfterMs: 1500 },
        }) satisfies DatabaseConfig,
    },
    {
      provide: REDIS_BUFFER_HANDLER_CONFIG,
      inject: [CommentsConfigService],
      useFactory: (configService: CommentsConfigService) =>
        ({
          host: configService.REDIS_HOST,
          port: configService.REDIS_PORT,
          service: 'comments',
          logErrors: true,
          resilienceOptions: { maxRetries: 3, circuitBreakerThreshold: 10, halfOpenAfterMs: 1500 },
        }) satisfies RedisBufferHandlerConfig,
    },
    {
      provide: COMMENTS_REDIS_STREAM_CONFIG,
      inject: [CommentsConfigService],
      useFactory: (configService: CommentsConfigService) =>
        ({
          key: configService.REDIS_STREAM_KEY,
          groupName: configService.REDIS_STREAM_GROUPNAME,
        }) satisfies StreamConfig,
    },
    {
      provide: REDIS_CACHE_CONFIG,
      inject: [CommentsConfigService],
      useFactory: (configService: CommentsConfigService) =>
        ({
          host: configService.REDIS_HOST,
          port: configService.REDIS_PORT,
          service: 'comments',
          logErrors: true,
          resilienceOptions: { maxRetries: 3, circuitBreakerThreshold: 10, halfOpenAfterMs: 1500 },
        }) satisfies RedisCacheHandlerConfig,
    },
    {
      provide: COMMENTS_REPOSITORY_PORT,
      useClass: PrismaMongoDBRepositoryAdapter,
    },
    { provide: COMMENTS_CACHE_PORT, useClass: RedisCacheAdapter },
    {
      provide: KAFKA_EVENT_CONSUMER_CONFIG,
      inject: [CommentsConfigService],
      useFactory: (configService: CommentsConfigService) =>
        ({
          host: configService.KAFKA_HOST,
          port: configService.KAFKA_PORT,
          service: 'comments',
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
          dlqTopic: `dlq.comments`,
        }) satisfies KafkaEventConsumerHandlerConfig,
    },
    {
      provide: KAFKA_EVENT_PUBLISHER_HANDLER_CONFIG,
      inject: [CommentsConfigService],
      useFactory: (configService: CommentsConfigService) =>
        ({
          host: configService.KAFKA_HOST,
          port: configService.KAFKA_PORT,
          service: 'comments',
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
          dlqTopic: `dlq.comments`,
        }) satisfies KafkaEventPublisherHandlerConfig,
    },
    { provide: EVENT_PUBLISHER, useClass: KafkaEventPublisherHandler },
    { provide: EVENT_CONSUMER, useClass: KafkaEventConsumerHandler },
    { provide: COMMENTS_BUFFER_PORT, useClass: RedisStreamBufferAdapter },
    {
      provide: LOGGER_PORT,
      useClass: LokiConsoleLogger,
    },
    {
      provide: KAFKA_HOST,
      inject: [CommentsConfigService],
      useFactory: (configService: CommentsConfigService) => configService.KAFKA_HOST,
    },
    {
      provide: KAFKA_PORT,
      inject: [CommentsConfigService],
      useFactory: (configService: CommentsConfigService) => configService.KAFKA_PORT,
    },
    {
      provide: KAFKA_CA_CERT,
      inject: [CommentsConfigService],
      useFactory: (configService: CommentsConfigService) => configService.KAFKA_CA_CERT,
    },
    {
      provide: KAFKA_ACCESS_CERT,
      inject: [CommentsConfigService],
      useFactory: (configService: CommentsConfigService) => configService.ACCESS_CERT,
    },
    {
      provide: KAFKA_ACCESS_KEY,
      inject: [CommentsConfigService],
      useFactory: (configService: CommentsConfigService) => configService.ACCESS_KEY,
    },
    {
      provide: KAFKA_CLIENT,
      inject: [CommentsConfigService],
      useFactory: (configService: CommentsConfigService) => configService.KAFKA_CLIENT_ID,
    },
    {
      provide: KAFKA_CONSUMER,
      inject: [CommentsConfigService],
      useFactory: (configService: CommentsConfigService) => configService.KAFKA_CONSUMER_ID,
    },
    {
      provide: REDIS_HOST,
      inject: [CommentsConfigService],
      useFactory: (configService: CommentsConfigService) => configService.REDIS_HOST,
    },
    {
      provide: REDIS_PORT,
      inject: [CommentsConfigService],
      useFactory: (configService: CommentsConfigService) => configService.REDIS_PORT,
    },
    {
      provide: PRISMA_CLIENT,
      useValue: CommentsPrismaClient,
    },
    {
      provide: PRISMA_CLIENT_NAME,
      useValue: 'comments',
    },
  ],
  exports: [
    RedisBufferHandler,
    RedisCacheHandler,
    PrismaHandler,

    CommentAggregatePersistance,
    KafkaEventPublisherHandler,
    KafkaEventConsumerHandler,
    PrismaHandler,
    RedisCacheHandler,

    KafkaClient,
    RedisClient,
    PrismaDBClient,

    CqrsModule,
    MeasureModule,
    CommentsConfigService,

    EVENT_CONSUMER,
    EVENT_PUBLISHER,
    KAFKA_EVENT_PUBLISHER_HANDLER_CONFIG,
    KAFKA_EVENT_CONSUMER_CONFIG,
    COMMENTS_REDIS_STREAM_CONFIG,
    COMMENTS_REPOSITORY_PORT,
    MESSAGE_BROKER,
    COMMENTS_CACHE_PORT,
    LOGGER_PORT,
    COMMENTS_BUFFER_PORT,
    PRISMA_CLIENT,
    PRISMA_CLIENT_NAME,
    KAFKA_CLIENT,
    KAFKA_CONSUMER,
    KAFKA_HOST,
    KAFKA_PORT,
    KAFKA_CA_CERT,
    KAFKA_ACCESS_CERT,
    KAFKA_ACCESS_KEY,
    REDIS_HOST,
    REDIS_PORT,
  ],
})
export class FrameworkModule {}
