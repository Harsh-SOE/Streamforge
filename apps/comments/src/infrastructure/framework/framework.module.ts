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
  REDIS_HOST,
  REDIS_PORT,
  REDIS_STREAM_GROUPNAME,
  REDIS_STREAM_KEY,
  RedisClient,
} from '@app/clients/redis';
import {
  REDIS_CACHE_CONFIG,
  RedisCacheHandler,
  RedisCacheHandlerConfig,
} from '@app/handlers/redis-cache-handler';
import {
  REDIS_BUFFER_CONFIG,
  RedisBufferHandler,
  RedisBufferHandlerConfig,
} from '@app/handlers/redis-buffer-handler';
import { LOGGER_PORT } from '@app/ports/logger';
import { MESSAGE_BROKER } from '@app/ports/message-broker';
import { LOKI_URL, LokiConsoleLogger } from '@app/utils/loki-console-logger';
import { PRISMA_CLIENT, PRISMA_CLIENT_NAME, PrismaDBClient } from '@app/clients/prisma';
import { DATABASE_CONFIG, DatabaseConfig, PrismaHandler } from '@app/handlers/database-handler';
import { KAFKA_CONFIG, KafkaHandler, KafkaHandlerConfig } from '@app/handlers/kafka-bus-handler';

import {
  COMMENTS_BUFFER_PORT,
  COMMENTS_CACHE_PORT,
  COMMENTS_REPOSITORY_PORT,
} from '@comments/application/ports';

import { MeasureModule } from '../measure';
import { CommentsConfigService } from '../config';
import { RedisCacheAdapter } from '../cache/adapters';
import { RedisStreamBufferAdapter } from '../buffer/adapters';
import { CommentAggregatePersistance } from '../anti-corruption';
import { KafkaMessageBusAdapter } from '../message-bus/adapters';
import { PrismaMongoDBRepositoryAdapter } from '../repository/adapters';

import { PrismaClient as CommentsPrismaClient } from '@peristance/comments';

@Global()
@Module({
  imports: [MeasureModule, CqrsModule],
  providers: [
    CommentsConfigService,
    RedisBufferHandler,
    RedisCacheHandler,
    KafkaHandler,
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
      provide: KAFKA_CONFIG,
      inject: [CommentsConfigService],
      useFactory: (configService: CommentsConfigService) =>
        ({
          host: configService.KAFKA_HOST,
          port: configService.KAFKA_PORT,
          service: 'comments',
          logErrors: true,
          resilienceOptions: { maxRetries: 3, circuitBreakerThreshold: 10, halfOpenAfterMs: 1500 },
        }) satisfies KafkaHandlerConfig,
    },
    {
      provide: REDIS_BUFFER_CONFIG,
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
    { provide: MESSAGE_BROKER, useClass: KafkaMessageBusAdapter },
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
      provide: REDIS_STREAM_KEY,
      inject: [CommentsConfigService],
      useFactory: (configService: CommentsConfigService) => configService.REDIS_STREAM_KEY,
    },
    {
      provide: REDIS_STREAM_GROUPNAME,
      inject: [CommentsConfigService],
      useFactory: (configService: CommentsConfigService) => configService.REDIS_STREAM_GROUPNAME,
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
    KafkaHandler,
    PrismaHandler,

    CommentAggregatePersistance,
    KafkaHandler,
    PrismaHandler,
    RedisCacheHandler,

    KafkaClient,
    RedisClient,
    PrismaDBClient,

    CqrsModule,
    MeasureModule,
    CommentsConfigService,

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
    REDIS_STREAM_GROUPNAME,
    REDIS_STREAM_KEY,
  ],
})
export class FrameworkModule {}
