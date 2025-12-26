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
import { KAFKA_CONFIG, KafkaHandler, KafkaHandlerConfig } from '@app/handlers/kafka-bus-handler';
import { REDIS_BUFFER_CONFIG, RedisBufferHandlerConfig } from '@app/handlers/redis-buffer-handler';

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
import { KafkaMessageBusAdapter } from '../message-bus/adapters';
import { FFmpegVideoTranscoderUploaderAdapter } from '../transcoder/adapters';
import { BullSegmentUploadWorker, BullTranscodeJobsWorker } from '../workers';

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
    KafkaHandler,
    KafkaClient,
    RedisClient,
    SegmentWatcher,
    BullTranscodeJobsWorker,
    BullSegmentUploadWorker,
    TranscoderConfigService,
    KafkaHandler,
    RedisCacheHandler,
    SegmentWatcher,
    {
      provide: KAFKA_CONFIG,
      inject: [TranscoderConfigService],
      useFactory: (configService: TranscoderConfigService) =>
        ({
          host: configService.KAFKA_HOST,
          port: configService.KAFKA_PORT,
          service: 'transcoder',
          logErrors: true,
          resilienceOptions: { maxRetries: 3, circuitBreakerThreshold: 10, halfOpenAfterMs: 1500 },
        }) satisfies KafkaHandlerConfig,
    },
    {
      provide: REDIS_BUFFER_CONFIG,
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
    { provide: MESSAGE_BROKER, useClass: KafkaMessageBusAdapter },
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
    {
      provide: REDIS_STREAM_KEY,
      inject: [TranscoderConfigService],
      useFactory: (configService: TranscoderConfigService) => configService.REDIS_STREAM_KEY,
    },
    {
      provide: REDIS_STREAM_GROUPNAME,
      inject: [TranscoderConfigService],
      useFactory: (configService: TranscoderConfigService) => configService.REDIS_STREAM_GROUPNAME,
    },
  ],
  exports: [
    MeasureModule,
    CqrsModule,
    TranscoderConfigService,

    KafkaClient,
    RedisClient,

    KafkaHandler,
    RedisCacheHandler,

    SegmentWatcher,
    BullTranscodeJobsWorker,
    BullSegmentUploadWorker,
    SegmentWatcher,

    MESSAGE_BROKER,
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
    REDIS_STREAM_GROUPNAME,
    TRANSCODER_STORAGE_PORT,
    REDIS_STREAM_KEY,
    TRANSCODER_PORT,

    BullModule,
  ],
})
export class FrameworkModule {}
