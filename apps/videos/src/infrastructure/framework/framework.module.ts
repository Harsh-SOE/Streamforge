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
  STORAGE_PORT,
  VIDEOS_BUFFER_PORT,
  VIDEOS_CACHE_PORT,
  VIDEOS_RESPOSITORY_PORT,
} from '@videos/application/ports';
import { MeasureModule } from '@videos/infrastructure/measure';
import { RedisCacheAdapter } from '@videos/infrastructure/cache/adapters';
import { AwsS3StorageAdapter } from '@videos/infrastructure/storage/adapters';
import { RedisStreamBufferAdapter } from '@videos/infrastructure/buffer/adapters';
import { VideosConfigModule, VideosConfigService } from '@videos/infrastructure/config';
import { VideoRepositoryAdapter } from '@videos/infrastructure/repository/adapters';
import { VideoAggregatePersistanceACL } from '@videos/infrastructure/anti-corruption';
import { KafkaMessageBusAdapter } from '@videos/infrastructure/message-bus/adapters';

import { PrismaClient as VideoPrismaClient } from '@persistance/videos';

@Global()
@Module({
  imports: [MeasureModule, VideosConfigModule],
  providers: [
    VideosConfigService,
    VideoAggregatePersistanceACL,
    RedisBufferHandler,
    RedisCacheHandler,
    KafkaHandler,
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
      provide: KAFKA_CONFIG,
      inject: [VideosConfigService],
      useFactory: (configService: VideosConfigService) =>
        ({
          host: configService.KAFKA_HOST,
          port: configService.KAFKA_PORT,
          service: 'videos',
          logErrors: true,
          resilienceOptions: { maxRetries: 3, circuitBreakerThreshold: 10, halfOpenAfterMs: 1500 },
        }) satisfies KafkaHandlerConfig,
    },
    {
      provide: REDIS_BUFFER_CONFIG,
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
    { provide: MESSAGE_BROKER, useClass: KafkaMessageBusAdapter },
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
      provide: REDIS_STREAM_KEY,
      inject: [VideosConfigService],
      useFactory: (configService: VideosConfigService) => configService.REDIS_STREAM_KEY,
    },
    {
      provide: REDIS_STREAM_GROUPNAME,
      inject: [VideosConfigService],
      useFactory: (configService: VideosConfigService) => configService.REDIS_STREAM_GROUPNAME,
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

    KafkaHandler,
    PrismaHandler,
    RedisCacheHandler,
    RedisBufferHandler,

    VideoPrismaClient,
    KafkaClient,
    RedisClient,

    VIDEOS_RESPOSITORY_PORT,
    VIDEOS_BUFFER_PORT,
    MESSAGE_BROKER,
    VIDEOS_CACHE_PORT,
    STORAGE_PORT,
    LOGGER_PORT,
    REDIS_HOST,
    REDIS_PORT,
    REDIS_STREAM_GROUPNAME,
    REDIS_STREAM_KEY,
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
