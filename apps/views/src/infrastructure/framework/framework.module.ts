import { CqrsModule } from '@nestjs/cqrs';
import { Global, Module } from '@nestjs/common';

import {
  REDIS_HOST,
  REDIS_PORT,
  REDIS_STREAM_GROUPNAME,
  REDIS_STREAM_KEY,
  RedisClient,
} from '@app/clients/redis';
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
} from '@app/handlers/redis-cache-handler';
import {
  REDIS_BUFFER_CONFIG,
  RedisBufferHandler,
  RedisBufferHandlerConfig,
} from '@app/handlers/redis-buffer-handler';
import { LOGGER_PORT } from '@app/ports/logger';
import { LOKI_URL, LokiConsoleLogger } from '@app/utils/loki-console-logger';
import { PRISMA_CLIENT, PRISMA_CLIENT_NAME, PrismaDBClient } from '@app/clients/prisma';
import { DATABASE_CONFIG, DatabaseConfig, PrismaHandler } from '@app/handlers/database-handler';
import { KAFKA_CONFIG, KafkaHandler, KafkaHandlerConfig } from '@app/handlers/kafka-bus-handler';

import {
  VIEWS_BUFFER_PORT,
  VIEWS_CACHE_PORT,
  VIEWS_REPOSITORY_PORT,
} from '@views/application/ports';

import { PrismaClient as ViewPrismaClient } from '@persistance/views';

import { MeasureModule } from '../measure';
import { ViewCacheAdapter } from '../cache/adapters';
import { RedisStreamBufferAdapter } from '../buffer/adapters';
import { ViewRepositoryAdapter } from '../repository/adapters';
import { ViewPeristanceAggregateACL } from '../anti-corruption';
import { ViewsConfigModule, ViewsConfigService } from '../config';

@Global()
@Module({
  imports: [MeasureModule, CqrsModule, ViewsConfigModule],
  providers: [
    ViewPeristanceAggregateACL,
    ViewsConfigService,
    KafkaHandler,
    PrismaHandler,
    RedisCacheHandler,
    RedisBufferHandler,
    PrismaDBClient,
    KafkaClient,
    RedisClient,
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
    {
      provide: KAFKA_CONFIG,
      inject: [ViewsConfigService],
      useFactory: (configService: ViewsConfigService) =>
        ({
          host: configService.KAFKA_HOST,
          port: configService.KAFKA_PORT,
          service: 'views',
          logErrors: true,
          resilienceOptions: { maxRetries: 3, circuitBreakerThreshold: 10, halfOpenAfterMs: 1500 },
        }) satisfies KafkaHandlerConfig,
    },
    {
      provide: REDIS_BUFFER_CONFIG,
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
    {
      provide: LOKI_URL,
      inject: [ViewsConfigService],
      useFactory: (configService: ViewsConfigService) => configService.GRAFANA_LOKI_URL,
    },
    { provide: VIEWS_CACHE_PORT, useClass: ViewCacheAdapter },
    { provide: VIEWS_REPOSITORY_PORT, useClass: ViewRepositoryAdapter },
    { provide: VIEWS_BUFFER_PORT, useClass: RedisStreamBufferAdapter },
    { provide: LOGGER_PORT, useClass: LokiConsoleLogger },
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
      provide: REDIS_STREAM_KEY,
      inject: [ViewsConfigService],
      useFactory: (configService: ViewsConfigService) => configService.REDIS_STREAM_KEY,
    },
    {
      provide: REDIS_STREAM_GROUPNAME,
      inject: [ViewsConfigService],
      useFactory: (configService: ViewsConfigService) => configService.REDIS_STREAM_GROUPNAME,
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

    KafkaHandler,
    PrismaHandler,
    RedisCacheHandler,

    KafkaClient,
    RedisClient,
    PrismaDBClient,

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
    REDIS_STREAM_GROUPNAME,
    REDIS_STREAM_KEY,
    RedisClient,
  ],
})
export class FrameworkModule {}
