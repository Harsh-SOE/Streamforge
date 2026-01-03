import { Global, Module } from '@nestjs/common';

import { KAFKA_CLIENT_CONFIG, KafkaClientConfig, KafkaClient } from '@app/clients/kafka';
import { REDIS_CLIENT_CONFIG, RedisClientConfig, RedisClient } from '@app/clients/redis';
import {
  REDIS_CACHE_HANDLER_CONFIG,
  RedisCacheHandler,
  RedisCacheHandlerConfig,
} from '@app/handlers/cache/redis';
import {
  REDIS_BUFFER_HANDLER_CONFIG,
  RedisBufferHandler,
  RedisBufferHandlerConfig,
} from '@app/handlers/buffer/redis';
import { LOGGER_PORT } from '@app/common/ports/logger';
import { LOKI_CONFIG, LokiConsoleLogger } from '@app/utils/loki-console-logger';
import { PRISMA_CLIENT, PRISMA_CLIENT_NAME, PrismaDBClient } from '@app/clients/prisma';
import {
  KAFKA_EVENT_CONSUMER_HANDLER_CONFIG,
  KafkaEventConsumerHandler,
  KafkaEventConsumerHandlerConfig,
} from '@app/handlers/events-consumer/kafka';
import {
  KAFKA_EVENT_PUBLISHER_HANDLER_CONFIG,
  KafkaEventPublisherHandler,
  KafkaEventPublisherHandlerConfig,
} from '@app/handlers/events-publisher/kafka';
import { EVENT_CONSUMER_PORT, EVENT_PUBLISHER_PORT } from '@app/common/ports/events';
import {
  DATABASE_HANDLER_CONFIG,
  DatabaseConfig,
  PrismaHandler,
} from '@app/handlers/database/prisma';

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

import { VideosKafkaPublisherAdapter } from '../events-publisher/adapters';
import { VideosKafkaConsumerAdapter } from '../events-consumers/adapters';
import { KAFKA_BUFFER_HANDLER_CONFIG, KafkaBufferHandlerConfig } from '@app/handlers/buffer/kafka';

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
      provide: DATABASE_HANDLER_CONFIG,
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
      provide: REDIS_CACHE_HANDLER_CONFIG,
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
      provide: LOKI_CONFIG,
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
      provide: KAFKA_EVENT_CONSUMER_HANDLER_CONFIG,
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
      provide: KAFKA_BUFFER_HANDLER_CONFIG,
      inject: [VideosConfigService],
      useFactory: (configService: VideosConfigService) =>
        ({
          host: configService.KAFKA_HOST,
          port: configService.KAFKA_PORT,
          service: 'videos',
          logErrors: true,
          resilienceOptions: { maxRetries: 3, circuitBreakerThreshold: 10, halfOpenAfterMs: 1500 },
        }) satisfies KafkaBufferHandlerConfig,
    },
    {
      provide: EVENT_PUBLISHER_PORT,
      useClass: VideosKafkaPublisherAdapter,
    },
    {
      provide: EVENT_CONSUMER_PORT,
      useClass: VideosKafkaConsumerAdapter,
    },
    { provide: VIDEOS_CACHE_PORT, useClass: RedisCacheAdapter },
    { provide: STORAGE_PORT, useClass: AwsS3StorageAdapter },
    { provide: LOGGER_PORT, useClass: LokiConsoleLogger },
    {
      provide: KAFKA_CLIENT_CONFIG,
      inject: [VideosConfigService],
      useFactory: (configService: VideosConfigService) =>
        ({
          host: configService.KAFKA_HOST,
          port: configService.KAFKA_PORT,
          accessCert: configService.ACCESS_CERT,
          accessKey: configService.ACCESS_KEY,
          caCert: configService.KAFKA_CA_CERT,
          clientId: 'videos-service',
        }) satisfies KafkaClientConfig,
    },
    {
      provide: REDIS_CLIENT_CONFIG,
      inject: [VideosConfigService],
      useFactory: (configService: VideosConfigService) =>
        ({
          host: configService.REDIS_HOST,
          port: configService.REDIS_PORT,
        }) satisfies RedisClientConfig,
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
    KAFKA_CLIENT_CONFIG,
    REDIS_CLIENT_CONFIG,
    PRISMA_CLIENT,
    PRISMA_CLIENT_NAME,
    KAFKA_BUFFER_HANDLER_CONFIG,
    VIDEOS_REDIS_STREAM_CONFIG,
  ],
})
export class PlatformModule {}
