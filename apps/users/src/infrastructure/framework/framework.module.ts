import { CqrsModule } from '@nestjs/cqrs';
import { Global, Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';

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

import {
  USER_CACHE_PORT,
  USER_REROSITORY_PORT,
  USERS_BUFFER_PORT,
  USERS_STORAGE_PORT,
} from '@users/application/ports';
import { MeasureModule } from '@users/infrastructure/measure';
import { UserCommandHandlers } from '@users/application/commands';
import { UsersRedisBuffer } from '@users/infrastructure/buffer/adapters';
import { RedisCacheAdapter } from '@users/infrastructure/cache/adapters';
import { UserEventHandlers } from '@users/application/intergration-events';
import { AwsS3StorageAdapter } from '@users/infrastructure/storage/adapters';
import { UserRepositoryAdapter } from '@users/infrastructure/repository/adapters';
import { UserConfigModule, UserConfigService } from '@users/infrastructure/config';
import { UserAggregatePersistanceACL } from '@users/infrastructure/anti-corruption/aggregate-persistance-acl';

import { PrismaClient as UserPrismaClient } from '@persistance/users';

import { UsersKafkaPublisherAdapter } from '../events-bus/publisher/adapters';
import { UsersKafkaConsumerAdapter } from '../events-bus/consumer/adapters';

@Global()
@Module({
  imports: [
    MeasureModule,
    CqrsModule,
    CacheModule.registerAsync({
      imports: [UserConfigModule],
      inject: [UserConfigService],
      isGlobal: true,
      useFactory: (configService: UserConfigService) => ({
        isGlobal: true,
        store: redisStore,
        host: configService.REDIS_HOST,
        port: configService.REDIS_PORT,
      }),
    }),
  ],
  providers: [
    UserAggregatePersistanceACL,
    PrismaHandler,
    RedisCacheHandler,
    KafkaEventPublisherHandler,
    KafkaEventConsumerHandler,
    PrismaDBClient,
    KafkaClient,
    RedisClient,
    {
      provide: DATABASE_CONFIG,
      inject: [UserConfigService],
      useFactory: (configService: UserConfigService) =>
        ({
          host: configService.DATABASE_URL,
          service: 'users',
          logErrors: true,
          resilienceOptions: { maxRetries: 3, circuitBreakerThreshold: 10, halfOpenAfterMs: 1500 },
        }) satisfies DatabaseConfig,
    },
    {
      provide: REDIS_BUFFER_HANDLER_CONFIG,
      inject: [UserConfigService],
      useFactory: (configService: UserConfigService) =>
        ({
          host: configService.REDIS_HOST,
          port: configService.REDIS_PORT,
          service: 'users',
          logErrors: true,
          resilienceOptions: { maxRetries: 3, circuitBreakerThreshold: 10, halfOpenAfterMs: 1500 },
        }) satisfies RedisBufferHandlerConfig,
    },
    {
      provide: REDIS_CACHE_CONFIG,
      inject: [UserConfigService],
      useFactory: (configService: UserConfigService) =>
        ({
          host: configService.REDIS_HOST,
          port: configService.REDIS_PORT,
          service: 'users',
          logErrors: true,
          resilienceOptions: { maxRetries: 3, circuitBreakerThreshold: 10, halfOpenAfterMs: 1500 },
        }) satisfies RedisCacheHandlerConfig,
    },
    {
      provide: USER_REROSITORY_PORT,
      useClass: UserRepositoryAdapter,
    },
    {
      provide: USER_CACHE_PORT,
      useClass: RedisCacheAdapter,
    },
    {
      provide: KAFKA_EVENT_CONSUMER_CONFIG,
      inject: [UserConfigService],
      useFactory: (configService: UserConfigService) =>
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
      inject: [UserConfigService],
      useFactory: (configService: UserConfigService) =>
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
      useClass: UsersKafkaPublisherAdapter,
    },
    {
      provide: EVENT_CONSUMER,
      useClass: UsersKafkaConsumerAdapter,
    },
    {
      provide: LOKI_URL,
      inject: [UserConfigService],
      useFactory: (configService: UserConfigService) => configService.GRAFANA_LOKI_URL,
    },
    { provide: LOGGER_PORT, useClass: LokiConsoleLogger },
    { provide: USERS_STORAGE_PORT, useClass: AwsS3StorageAdapter },
    { provide: USERS_BUFFER_PORT, useClass: UsersRedisBuffer },
    {
      provide: KAFKA_HOST,
      inject: [UserConfigService],
      useFactory: (configService: UserConfigService) => configService.KAFKA_HOST,
    },
    {
      provide: KAFKA_PORT,
      inject: [UserConfigService],
      useFactory: (configService: UserConfigService) => configService.KAFKA_PORT,
    },
    {
      provide: KAFKA_CLIENT,
      inject: [UserConfigService],
      useFactory: (configService: UserConfigService) => configService.KAFKA_CLIENT_ID,
    },
    {
      provide: KAFKA_CA_CERT,
      inject: [UserConfigService],
      useFactory: (configService: UserConfigService) => configService.KAFKA_CA_CERT,
    },
    {
      provide: KAFKA_ACCESS_CERT,
      inject: [UserConfigService],
      useFactory: (configService: UserConfigService) => configService.ACCESS_CERT,
    },
    {
      provide: KAFKA_ACCESS_KEY,
      inject: [UserConfigService],
      useFactory: (configService: UserConfigService) => configService.ACCESS_KEY,
    },
    {
      provide: KAFKA_CONSUMER,
      inject: [UserConfigService],
      useFactory: (configService: UserConfigService) => configService.KAFKA_CONSUMER_ID,
    },
    {
      provide: REDIS_HOST,
      inject: [UserConfigService],
      useFactory: (configService: UserConfigService) => configService.REDIS_HOST,
    },
    {
      provide: REDIS_PORT,
      inject: [UserConfigService],
      useFactory: (configService: UserConfigService) => configService.REDIS_PORT,
    },
    {
      provide: PRISMA_CLIENT,
      useValue: UserPrismaClient,
    },
    {
      provide: PRISMA_CLIENT_NAME,
      useValue: 'users',
    },
    ...UserCommandHandlers,
    ...UserEventHandlers,
  ],
  exports: [
    MeasureModule,
    CqrsModule,
    CacheModule,
    UserAggregatePersistanceACL,

    PrismaHandler,
    RedisCacheHandler,
    KafkaEventPublisherHandler,
    KafkaEventConsumerHandler,

    KafkaClient,
    RedisClient,
    PrismaDBClient,

    USER_REROSITORY_PORT,

    USER_CACHE_PORT,
    LOKI_URL,
    LOGGER_PORT,
    USERS_STORAGE_PORT,
    USERS_BUFFER_PORT,
    EVENT_PUBLISHER,
    EVENT_CONSUMER,
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

    ...UserCommandHandlers,
    ...UserEventHandlers,
  ],
})
export class FrameworkModule {}
