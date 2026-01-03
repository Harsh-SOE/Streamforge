import Redis from 'ioredis';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Inject, Injectable, OnModuleInit, Optional } from '@nestjs/common';

import { RedisClient } from '@app/clients/redis';
import { LOGGER_PORT, LoggerPort } from '@app/common/ports/logger';

import {
  VideosBufferPort,
  VIDEOS_RESPOSITORY_PORT,
  VideoRepositoryPort,
} from '@videos/application/ports';
import { VideoAggregate } from '@videos/domain/aggregates';
import { VideosConfigService } from '@videos/infrastructure/config';

import { VideoMessage, StreamData } from '../types';

export interface StreamConfig {
  key: string;
  groupName: string;
}

export const VIDEOS_REDIS_STREAM_CONFIG = Symbol('VIDEOS_REDIS_STREAM_CONFIG');

@Injectable()
export class RedisStreamBufferAdapter implements VideosBufferPort, OnModuleInit {
  private readonly client: Redis;

  public constructor(
    private readonly configService: VideosConfigService,
    @Inject(LOGGER_PORT) private readonly logger: LoggerPort,
    @Inject(VIDEOS_RESPOSITORY_PORT)
    private readonly videosRepository: VideoRepositoryPort,
    private readonly redis: RedisClient,
    @Optional()
    @Inject(VIDEOS_REDIS_STREAM_CONFIG)
    private readonly streamConfig?: StreamConfig,
  ) {
    this.client = redis.getClient();
  }

  public async connect(): Promise<void> {
    await this.client.connect();
  }

  public async disconnect(): Promise<void> {
    await this.client.quit();
  }

  public async createStream() {
    if (!this.streamConfig) return;
    try {
      await this.client.xgroup(
        'CREATE',
        this.streamConfig.key,
        this.streamConfig.groupName,
        '0',
        'MKSTREAM',
      );

      this.logger.info(`Stream with key:${this.streamConfig.key} was created successfully`);
    } catch (error) {
      const err = error as Error;
      if (err.message.includes('BUSYGROUP')) {
        this.logger.alert(
          `Stream with key: ${this.streamConfig.key} already exists, skipping creation`,
        );
      } else {
        throw err;
      }
    }
  }

  public async onModuleInit() {
    await this.connect();
    await this.disconnect();
    await this.createStream();
  }

  public async bufferVideo(video: VideoAggregate): Promise<void> {
    await this.client.xadd(
      this.configService.REDIS_STREAM_KEY,
      '*',
      'like-message',
      JSON.stringify(video.getSnapshot()),
    );
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  public async processVideosBatch() {
    this.logger.alert(`Processing videos in batches now`);

    const streamData = (await this.client.xreadgroup(
      'GROUP',
      this.configService.REDIS_STREAM_GROUPNAME,
      this.configService.REDIS_STREAM_CONSUMER_ID,
      'COUNT',
      10,
      'BLOCK',
      5000,
      'STREAMS',
      this.configService.REDIS_STREAM_KEY,
      '>',
    )) as StreamData[];

    if (!streamData || streamData.length === 0) {
      return 0;
    }

    const { ids, extractedMessages } = this.extractMessageFromStream(streamData);

    return await this.processMessages(ids, extractedMessages);
  }

  public extractMessageFromStream(stream: StreamData[]) {
    const messages: VideoMessage[] = [];
    const ids: string[] = [];
    for (const [streamKey, entities] of stream) {
      this.logger.info(`Processing stream: ${streamKey}`);
      for (const [id, message] of entities) {
        this.logger.info(`Recieved an element with id:${id}`);
        ids.push(id);
        messages.push(JSON.parse(message[1]) as VideoMessage);
      }
    }
    return { ids: ids, extractedMessages: messages };
  }

  public async processMessages(ids: string[], messages: VideoMessage[]) {
    const models = messages.map((message) => {
      return VideoAggregate.create({
        id: message.id,
        ownerId: message.ownerId,
        channelId: message.channelId,
        title: message.title,
        videoThumbnailIdentifier: message.videoThumbnailIdentifier,
        videoFileIdentifier: message.videoFileIdentifier,
        categories: message.videoCategories,
        publishStatus: message.publishStatus,
        visibilityStatus: message.visibilityStatus,
        description: message.description,
      });
    });

    const processedMessagesNumber = await this.videosRepository.saveManyVideos(models);

    await this.client.xack(
      this.configService.REDIS_STREAM_KEY,
      this.configService.REDIS_STREAM_GROUPNAME,
      ...ids,
    );

    return processedMessagesNumber;
  }
}
