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
import { LOGGER_PORT } from '@app/ports/logger';
import { MESSAGE_BROKER } from '@app/ports/message-broker';
import { LOKI_URL, LokiConsoleLogger } from '@app/utils/loki-console-logger';
import { PRISMA_CLIENT, PRISMA_CLIENT_NAME, PrismaDBClient } from '@app/clients/prisma';
import { DATABASE_CONFIG, DatabaseConfig, PrismaHandler } from '@app/handlers/database-handler';
import { KAFKA_CONFIG, KafkaHandler, KafkaHandlerConfig } from '@app/handlers/kafka-bus-handler';
import { REDIS_BUFFER_CONFIG, RedisBufferHandlerConfig } from '@app/handlers/redis-buffer-handler';

import {
  REACTION_BUFFER_PORT,
  REACTION_CACHE_PORT,
  REACTION_DATABASE_PORT,
} from '@reaction/application/ports';

import { PrismaClient as ReactionPrismaClient } from '@persistance/reaction';

import { MeasureModule } from '../measure';
import { ReactionConfigService } from '../config';
import { RedisCacheAdapter } from '../cache/adapters';
import { RedisStreamBufferAdapter } from '../buffer/adapters';
import { KafkaMessageBusAdapter } from '../message-bus/adapters';
import { ReactionRepositoryAdapter } from '../repository/adapters';
import { ReactionAggregatePersistanceACL } from '../anti-corruption';

@Global()
@Module({
  imports: [MeasureModule, CqrsModule],
  providers: [
    ReactionConfigService,
    ReactionAggregatePersistanceACL,
    RedisCacheHandler,
    KafkaHandler,
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
      provide: KAFKA_CONFIG,
      inject: [ReactionConfigService],
      useFactory: (configService: ReactionConfigService) =>
        ({
          host: configService.KAFKA_HOST,
          port: configService.KAFKA_PORT,
          service: 'reaction',
          logErrors: true,
          resilienceOptions: { maxRetries: 3, circuitBreakerThreshold: 10, halfOpenAfterMs: 1500 },
        }) satisfies KafkaHandlerConfig,
    },
    {
      provide: REDIS_BUFFER_CONFIG,
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
    { provide: REACTION_DATABASE_PORT, useClass: ReactionRepositoryAdapter },
    { provide: REACTION_CACHE_PORT, useClass: RedisCacheAdapter },
    { provide: MESSAGE_BROKER, useClass: KafkaMessageBusAdapter },
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
      provide: REDIS_STREAM_KEY,
      inject: [ReactionConfigService],
      useFactory: (configService: ReactionConfigService) => configService.REDIS_STREAM_KEY,
    },
    {
      provide: REDIS_STREAM_GROUPNAME,
      inject: [ReactionConfigService],
      useFactory: (configService: ReactionConfigService) => configService.REDIS_STREAM_GROUPNAME,
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

    KafkaHandler,
    PrismaHandler,
    RedisCacheHandler,

    KafkaClient,
    RedisClient,
    PrismaDBClient,

    REACTION_DATABASE_PORT,
    MESSAGE_BROKER,
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
    REDIS_STREAM_GROUPNAME,
    REDIS_STREAM_KEY,
  ],
})
export class FrameworkModule {}
