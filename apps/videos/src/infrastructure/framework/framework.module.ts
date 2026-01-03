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
import { REDIS_HOST, REDIS_PORT, RedisClient } from '@app/clients/redis';
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
import { EVENT_CONSUMER, EVENT_PUBLISHER } from '@app/common/ports/events';
import {
  DATABASE_CONFIG,
  DatabaseConfig,
  PrismaHandler,
} from '@app/handlers/database-handler/prisma';

import {
  STORAGE_PORT,
  VIDEOS_BUFFER_PORT,
  VIDEOS_CACHE_PORT,
  VIDEOS_RESPOSITORY_PORT,
} from '@videos/application/ports';
import { MeasureModule } from '@videos/infrastructure/measure';
import { RedisCacheAdapter } from '@videos/infrastructure/cache/adapters';
import { AwsS3StorageAdapter } from '@videos/infrastructure/storage/adapters';
import {
  RedisStreamBufferAdapter,
  StreamConfig,
  VIDEOS_REDIS_STREAM_CONFIG,
} from '@videos/infrastructure/buffer/adapters';
import { VideosConfigModule, VideosConfigService } from '@videos/infrastructure/config';
import { VideoRepositoryAdapter } from '@videos/infrastructure/repository/adapters';
import { VideoAggregatePersistanceACL } from '@videos/infrastructure/anti-corruption';

import { PrismaClient as VideoPrismaClient } from '@persistance/videos';

import { VideosKafkaPublisherAdapter } from '../events/publisher/adapters';
import { VideosKafkaConsumerAdapter } from '../events/consumer/adapters';

@Global()
@Module({
  imports: [MeasureModule, VideosConfigModule],
  providers: [
    VideosConfigService,
    VideoAggregatePersistanceACL,
    RedisBufferHandler,
    RedisCacheHandler,
    KafkaEventConsumerHandler,
    KafkaEventPublisherHandler,
    PrismaHandler,
    RedisClient,
    KafkaClient,
    PrismaDBClient,
    VideoPrismaClient,
    {
      provide: DATABASE_CONFIG,
      inject: [VideosConfigService],
      useFactory: (configService: VideosConfigService) =>
        ({
          host: configService.DATABASE_URL,
          service: 'videos',
          logErrors: true,
          resilienceOptions: { maxRetries: 3, circuitBreakerThreshold: 10, halfOpenAfterMs: 1500 },
        }) satisfies DatabaseConfig,
    },
    {
      provide: REDIS_BUFFER_HANDLER_CONFIG,
      inject: [VideosConfigService],
      useFactory: (configService: VideosConfigService) =>
        ({
          host: configService.REDIS_HOST,
          port: configService.REDIS_PORT,
          service: 'videos',
          logErrors: true,
          resilienceOptions: { maxRetries: 3, circuitBreakerThreshold: 10, halfOpenAfterMs: 1500 },
        }) satisfies RedisBufferHandlerConfig,
    },
    {
      provide: REDIS_CACHE_CONFIG,
      inject: [VideosConfigService],
      useFactory: (configService: VideosConfigService) =>
        ({
          host: configService.REDIS_HOST,
          port: configService.REDIS_PORT,
          service: 'videos',
          logErrors: true,
          resilienceOptions: { maxRetries: 3, circuitBreakerThreshold: 10, halfOpenAfterMs: 1500 },
        }) satisfies RedisCacheHandlerConfig,
    },
    {
      provide: VIDEOS_RESPOSITORY_PORT,
      useClass: VideoRepositoryAdapter,
    },
    {
      provide: LOKI_URL,
      inject: [VideosConfigService],
      useFactory: (configService: VideosConfigService) => configService.GRAFANA_LOKI_URL,
    },
    { provide: VIDEOS_BUFFER_PORT, useClass: RedisStreamBufferAdapter },
    {
      provide: VIDEOS_REDIS_STREAM_CONFIG,
      inject: [VideosConfigService],
      useFactory: (configService: VideosConfigService) =>
        ({
          groupName: configService.REDIS_STREAM_GROUPNAME,
          key: configService.REDIS_STREAM_KEY,
        }) satisfies StreamConfig,
    },
    {
      provide: KAFKA_EVENT_CONSUMER_CONFIG,
      inject: [VideosConfigService],
      useFactory: (configService: VideosConfigService) =>
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
      inject: [VideosConfigService],
      useFactory: (configService: VideosConfigService) =>
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
    {
      provide: EVENT_PUBLISHER,
      useClass: VideosKafkaPublisherAdapter,
    },
    {
      provide: EVENT_CONSUMER,
      useClass: VideosKafkaConsumerAdapter,
    },
    { provide: VIDEOS_CACHE_PORT, useClass: RedisCacheAdapter },
    { provide: STORAGE_PORT, useClass: AwsS3StorageAdapter },
    { provide: LOGGER_PORT, useClass: LokiConsoleLogger },
    {
      provide: KAFKA_HOST,
      inject: [VideosConfigService],
      useFactory: (configService: VideosConfigService) => configService.KAFKA_HOST,
    },
    {
      provide: KAFKA_PORT,
      inject: [VideosConfigService],
      useFactory: (configService: VideosConfigService) => configService.KAFKA_PORT,
    },
    {
      provide: KAFKA_CA_CERT,
      inject: [VideosConfigService],
      useFactory: (configService: VideosConfigService) => configService.KAFKA_CA_CERT,
    },
    {
      provide: KAFKA_ACCESS_CERT,
      inject: [VideosConfigService],
      useFactory: (configService: VideosConfigService) => configService.ACCESS_CERT,
    },
    {
      provide: KAFKA_ACCESS_KEY,
      inject: [VideosConfigService],
      useFactory: (configService: VideosConfigService) => configService.ACCESS_KEY,
    },
    {
      provide: KAFKA_CLIENT,
      inject: [VideosConfigService],
      useFactory: (configService: VideosConfigService) => configService.KAFKA_CLIENT_ID,
    },
    {
      provide: KAFKA_CONSUMER,
      inject: [VideosConfigService],
      useFactory: (configService: VideosConfigService) => configService.KAFKA_CONSUMER_ID,
    },
    {
      provide: REDIS_HOST,
      inject: [VideosConfigService],
      useFactory: (configService: VideosConfigService) => configService.REDIS_HOST,
    },

    {
      provide: REDIS_PORT,
      inject: [VideosConfigService],
      useFactory: (configService: VideosConfigService) => configService.REDIS_PORT,
    },
    {
      provide: PRISMA_CLIENT,
      useValue: VideoPrismaClient,
    },
    {
      provide: PRISMA_CLIENT_NAME,
      useValue: 'videos',
    },
  ],
  exports: [
    MeasureModule,
    VideoAggregatePersistanceACL,
    VideosConfigModule,
    VideosConfigService,

    PrismaHandler,
    RedisCacheHandler,
    RedisBufferHandler,
    VideosKafkaConsumerAdapter,
    VideosKafkaPublisherAdapter,

    VideoPrismaClient,
    KafkaClient,
    RedisClient,
    KafkaEventConsumerHandler,
    KafkaEventPublisherHandler,

    VIDEOS_RESPOSITORY_PORT,
    VIDEOS_BUFFER_PORT,
    VIDEOS_CACHE_PORT,
    STORAGE_PORT,
    LOGGER_PORT,
    REDIS_HOST,
    REDIS_PORT,
    KAFKA_CLIENT,
    KAFKA_CONSUMER,
    KAFKA_HOST,
    KAFKA_PORT,
    KAFKA_ACCESS_CERT,
    KAFKA_ACCESS_KEY,
    KAFKA_CA_CERT,
  ],
})
export class FrameworkModule {}
