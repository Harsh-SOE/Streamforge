import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

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
import { LOGGER_PORT } from '@app/ports/logger';
import { REDIS_CACHE_CONFIG, RedisCacheHandlerConfig } from '@app/handlers/redis-cache-handler';
import { KAFKA_CONFIG, KafkaHandler, KafkaHandlerConfig } from '@app/handlers/kafka-bus-handler';
import { REDIS_BUFFER_CONFIG, RedisBufferHandlerConfig } from '@app/handlers/redis-buffer-handler';

import {
  CHANNEL_PROJECTION_REPOSITORY_PORT,
  USER_PROJECTION_REPOSITORY_PORT,
  PROJECTION_BUFFER_PORT,
  VIDEO_PROJECTION_REPOSITORY_PORT,
} from '@projection/application/ports';

import {
  ChannelProjectionModel,
  ChannelProjectionSchema,
  UserProjectionModel,
  VideoWatchProjectionModel,
  VideoWatchProjectionSchema,
  UserProjectionSchema,
} from '../repository/models';
import {
  ChannelProjectionRepository,
  UserProjectionRepository,
  VideoProjectionRepository,
} from '../repository/adapters';
import { KafkaBufferAdapter } from '../buffer/adapters';
import { ProjectionConfigModule, ProjectionConfigService } from '../config';
import { ChannelProjectionACL, UserProjectionACL, VideoProjectionACL } from '../anti-corruption';
import { LOKI_URL, LokiConsoleLogger } from '@app/utils/loki-console-logger';

@Global()
@Module({
  imports: [
    ProjectionConfigModule,
    MongooseModule.forRootAsync({
      imports: [ProjectionConfigModule],
      inject: [ProjectionConfigService],
      useFactory: (configService: ProjectionConfigService) => ({
        uri: configService.DATABASE_URL,
      }),
    }),
    MongooseModule.forFeature([
      {
        name: VideoWatchProjectionModel.name,
        schema: VideoWatchProjectionSchema,
      },
      {
        name: UserProjectionModel.name,
        schema: UserProjectionSchema,
      },
      {
        name: ChannelProjectionModel.name,
        schema: ChannelProjectionSchema,
      },
    ]),
  ],
  providers: [
    ProjectionConfigService,
    VideoProjectionACL,
    ChannelProjectionACL,
    UserProjectionACL,
    KafkaClient,
    KafkaHandler,
    {
      provide: LOKI_URL,
      inject: [ProjectionConfigService],
      useFactory: (configService: ProjectionConfigService) => configService.GRAFANA_LOKI_URL,
    },
    {
      provide: KAFKA_CONFIG,
      inject: [ProjectionConfigService],
      useFactory: (configService: ProjectionConfigService) =>
        ({
          host: configService.KAFKA_HOST,
          port: configService.KAFKA_PORT,
          service: 'projection',
          logErrors: true,
          resilienceOptions: { maxRetries: 3, circuitBreakerThreshold: 10, halfOpenAfterMs: 1500 },
        }) satisfies KafkaHandlerConfig,
    },
    {
      provide: REDIS_BUFFER_CONFIG,
      inject: [ProjectionConfigService],
      useFactory: (configService: ProjectionConfigService) =>
        ({
          host: configService.REDIS_HOST,
          port: configService.REDIS_PORT,
          service: 'projection',
          logErrors: true,
          resilienceOptions: { maxRetries: 3, circuitBreakerThreshold: 10, halfOpenAfterMs: 1500 },
        }) satisfies RedisBufferHandlerConfig,
    },
    {
      provide: REDIS_CACHE_CONFIG,
      inject: [ProjectionConfigService],
      useFactory: (configService: ProjectionConfigService) =>
        ({
          host: configService.REDIS_HOST,
          port: configService.REDIS_PORT,
          service: 'projection',
          logErrors: true,
          resilienceOptions: { maxRetries: 3, circuitBreakerThreshold: 10, halfOpenAfterMs: 1500 },
        }) satisfies RedisCacheHandlerConfig,
    },
    {
      provide: PROJECTION_BUFFER_PORT,
      useClass: KafkaBufferAdapter,
    },
    {
      provide: LOGGER_PORT,
      useClass: LokiConsoleLogger,
    },
    {
      provide: VIDEO_PROJECTION_REPOSITORY_PORT,
      useClass: VideoProjectionRepository,
    },
    {
      provide: USER_PROJECTION_REPOSITORY_PORT,
      useClass: UserProjectionRepository,
    },
    {
      provide: CHANNEL_PROJECTION_REPOSITORY_PORT,
      useClass: ChannelProjectionRepository,
    },
    {
      provide: KAFKA_HOST,
      inject: [ProjectionConfigService],
      useFactory: (configService: ProjectionConfigService) => configService.KAFKA_HOST,
    },
    {
      provide: KAFKA_PORT,
      inject: [ProjectionConfigService],
      useFactory: (configService: ProjectionConfigService) => configService.KAFKA_PORT,
    },
    {
      provide: KAFKA_CA_CERT,
      inject: [ProjectionConfigService],
      useFactory: (configService: ProjectionConfigService) => configService.KAFKA_CA_CERT,
    },
    {
      provide: KAFKA_ACCESS_CERT,
      inject: [ProjectionConfigService],
      useFactory: (configService: ProjectionConfigService) => configService.ACCESS_CERT,
    },
    {
      provide: KAFKA_ACCESS_KEY,
      inject: [ProjectionConfigService],
      useFactory: (configService: ProjectionConfigService) => configService.ACCESS_KEY,
    },
    {
      provide: KAFKA_CLIENT,
      inject: [ProjectionConfigService],
      useFactory: (configService: ProjectionConfigService) => configService.KAFKA_CLIENT_ID,
    },
    {
      provide: KAFKA_CONSUMER,
      inject: [ProjectionConfigService],
      useFactory: (configService: ProjectionConfigService) => configService.KAFKA_CONSUMER_ID,
    },
  ],
  exports: [
    ProjectionConfigService,
    VideoProjectionACL,
    ChannelProjectionACL,
    UserProjectionACL,
    KafkaClient,
    KafkaHandler,
    LOGGER_PORT,
    VIDEO_PROJECTION_REPOSITORY_PORT,
    USER_PROJECTION_REPOSITORY_PORT,
    PROJECTION_BUFFER_PORT,
    CHANNEL_PROJECTION_REPOSITORY_PORT,
    KAFKA_CLIENT,
    KAFKA_CONSUMER,
    KAFKA_HOST,
    KAFKA_PORT,
    KAFKA_CA_CERT,
    KAFKA_ACCESS_CERT,
    KAFKA_ACCESS_KEY,
  ],
})
export class FrameworkModule {}
