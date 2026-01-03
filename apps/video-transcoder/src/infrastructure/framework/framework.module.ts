import { CqrsModule } from '@nestjs/cqrs';
import { BullModule } from '@nestjs/bullmq';
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
import { LOGGER_PORT } from '@app/common/ports/logger';
import { LOKI_URL, LokiConsoleLogger } from '@app/utils/loki-console-logger';
import {
  REDIS_BUFFER_HANDLER_CONFIG,
  RedisBufferHandlerConfig,
} from '@app/handlers/buffer-handler/redis';

import {
  SEGMENT_DELETE_QUEUE,
  SEGMENT_UPLOADER_QUEUE,
  TRANSCODER_JOB_QUEUE,
} from '@transcoder/utils/constants';
import { TRANSCODER_PORT, TRANSCODER_STORAGE_PORT } from '@transcoder/application/ports';

import { MeasureModule } from '../measure';
import { AwsS3StorageAdapter } from '../storage/adapters';
import { TranscoderConfigModule, TranscoderConfigService } from '../config';
import { SegmentWatcher } from '../transcoder/segment-watcher';
import { FFmpegVideoTranscoderUploaderAdapter } from '../transcoder/adapters';
import { BullSegmentUploadWorker, BullTranscodeJobsWorker } from '../workers';
import { KafkaEventConsumerHandler } from '@app/handlers/event-bus-handler/kafka/consumer-handler';
import {
  KAFKA_EVENT_PUBLISHER_HANDLER_CONFIG,
  KafkaEventPublisherHandler,
  KafkaEventPublisherHandlerConfig,
} from '@app/handlers/event-bus-handler/kafka/publisher-handler';
import { EVENT_CONSUMER, EVENT_PUBLISHER } from '@app/common/ports/events';

@Global()
@Module({
  imports: [
    MeasureModule,
    CqrsModule,
    BullModule.forRootAsync({
      imports: [TranscoderConfigModule],
      inject: [TranscoderConfigService],
      useFactory: (configService: TranscoderConfigService) => ({
        connection: {
          url: `${configService.REDIS_HOST}:${configService.REDIS_PORT}`,
        },
      }),
    }),
    BullModule.registerQueue(
      { name: TRANSCODER_JOB_QUEUE },
      { name: SEGMENT_UPLOADER_QUEUE },
      { name: SEGMENT_DELETE_QUEUE },
    ),
  ],
  providers: [
    KafkaClient,
    RedisClient,
    SegmentWatcher,
    BullTranscodeJobsWorker,
    BullSegmentUploadWorker,
    TranscoderConfigService,

    KafkaEventPublisherHandler,
    KafkaEventConsumerHandler,

    RedisCacheHandler,
    SegmentWatcher,

    {
      provide: EVENT_PUBLISHER,
      useClass: KafkaEventPublisherHandler,
    },
    {
      provide: KAFKA_EVENT_PUBLISHER_HANDLER_CONFIG,
      inject: [TranscoderConfigService],
      useFactory: (configService: TranscoderConfigService) =>
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

    {
      provide: EVENT_CONSUMER,
      useClass: KafkaEventConsumerHandler,
    },

    {
      provide: REDIS_BUFFER_HANDLER_CONFIG,
      inject: [TranscoderConfigService],
      useFactory: (configService: TranscoderConfigService) =>
        ({
          host: configService.REDIS_HOST,
          port: configService.REDIS_PORT,
          service: 'transcoder',
          logErrors: true,
          resilienceOptions: { maxRetries: 3, circuitBreakerThreshold: 10, halfOpenAfterMs: 1500 },
        }) satisfies RedisBufferHandlerConfig,
    },
    {
      provide: REDIS_CACHE_CONFIG,
      inject: [TranscoderConfigService],
      useFactory: (configService: TranscoderConfigService) =>
        ({
          host: configService.REDIS_HOST,
          port: configService.REDIS_PORT,
          service: 'transcoder',
          logErrors: true,
          resilienceOptions: { maxRetries: 3, circuitBreakerThreshold: 10, halfOpenAfterMs: 1500 },
        }) satisfies RedisCacheHandlerConfig,
    },
    {
      provide: LOKI_URL,
      inject: [TranscoderConfigService],
      useFactory: (configService: TranscoderConfigService) => configService.GRAFANA_LOKI_URL,
    },
    { provide: LOGGER_PORT, useClass: LokiConsoleLogger },
    { provide: TRANSCODER_STORAGE_PORT, useClass: AwsS3StorageAdapter },
    {
      provide: TRANSCODER_PORT,
      useClass: FFmpegVideoTranscoderUploaderAdapter,
    },
    {
      provide: KAFKA_HOST,
      inject: [TranscoderConfigService],
      useFactory: (configService: TranscoderConfigService) => configService.KAFKA_HOST,
    },
    {
      provide: KAFKA_PORT,
      inject: [TranscoderConfigService],
      useFactory: (configService: TranscoderConfigService) => configService.KAFKA_PORT,
    },
    {
      provide: KAFKA_CLIENT,
      inject: [TranscoderConfigService],
      useFactory: (configService: TranscoderConfigService) => configService.KAFKA_CLIENT_ID,
    },
    {
      provide: KAFKA_CA_CERT,
      inject: [TranscoderConfigService],
      useFactory: (configService: TranscoderConfigService) => configService.KAFKA_CA_CERT,
    },
    {
      provide: KAFKA_ACCESS_CERT,
      inject: [TranscoderConfigService],
      useFactory: (configService: TranscoderConfigService) => configService.ACCESS_CERT,
    },
    {
      provide: KAFKA_ACCESS_KEY,
      inject: [TranscoderConfigService],
      useFactory: (configService: TranscoderConfigService) => configService.ACCESS_KEY,
    },
    {
      provide: KAFKA_CONSUMER,
      inject: [TranscoderConfigService],
      useFactory: (configService: TranscoderConfigService) => configService.KAFKA_CONSUMER_ID,
    },
    {
      provide: REDIS_HOST,
      inject: [TranscoderConfigService],
      useFactory: (configService: TranscoderConfigService) => configService.REDIS_HOST,
    },
    {
      provide: REDIS_PORT,
      inject: [TranscoderConfigService],
      useFactory: (configService: TranscoderConfigService) => configService.REDIS_PORT,
    },
  ],
  exports: [
    MeasureModule,
    CqrsModule,
    TranscoderConfigService,

    KafkaClient,
    RedisClient,

    RedisCacheHandler,

    SegmentWatcher,
    BullTranscodeJobsWorker,
    BullSegmentUploadWorker,
    SegmentWatcher,

    LOGGER_PORT,
    KAFKA_CLIENT,
    KAFKA_CONSUMER,
    KAFKA_CA_CERT,
    KAFKA_ACCESS_CERT,
    KAFKA_ACCESS_KEY,
    KAFKA_HOST,
    KAFKA_PORT,
    REDIS_HOST,
    REDIS_PORT,
    TRANSCODER_STORAGE_PORT,
    TRANSCODER_PORT,

    BullModule,
  ],
})
export class FrameworkModule {}
