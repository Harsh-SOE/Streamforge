import { Inject, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { RedisClient } from '@app/clients/redis';
import { LOGGER_PORT, LoggerPort } from '@app/ports/logger';

import {
  ViewsBufferPort,
  VIEWS_REPOSITORY_PORT,
  ViewRepositoryPort,
} from '@views/application/ports';
import { ViewAggregate } from '@views/domain/aggregates';
import { AppConfigService } from '@views/infrastructure/config';

import { ViewMessage, StreamData } from '../types';

@Injectable()
export class RedisStreamBufferAdapter implements ViewsBufferPort {
  public constructor(
    private readonly configService: AppConfigService,
    @Inject(LOGGER_PORT) private readonly logger: LoggerPort,
    @Inject(VIEWS_REPOSITORY_PORT)
    private readonly viewsRepo: ViewRepositoryPort,
    private readonly redis: RedisClient,
  ) {}

  public async bufferView(like: ViewAggregate): Promise<void> {
    await this.redis.client.xadd(
      this.configService.REDIS_STREAM_KEY,
      '*',
      'like-message',
      JSON.stringify(like.getEntity().getSnapshot()),
    );
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  public async processViewsBatch() {
    const streamData = (await this.redis.client.xreadgroup(
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
    const messages: ViewMessage[] = [];
    const ids: string[] = [];
    for (const [streamKey, entities] of stream) {
      this.logger.info(`Processing stream: ${streamKey}`);
      for (const [id, message] of entities) {
        this.logger.info(`Recieved an element with id:${id}`);
        ids.push(id);
        messages.push(JSON.parse(message[1]) as ViewMessage);
      }
    }
    return { ids: ids, extractedMessages: messages };
  }

  public async processMessages(ids: string[], messages: ViewMessage[]) {
    const models = messages.map((message) => {
      return ViewAggregate.create({ userId: message.userId, videoId: message.videoId });
    });

    const processedMessagesNumber = await this.viewsRepo.saveMany(models);

    await this.redis.client.xack(
      this.configService.REDIS_STREAM_KEY,
      this.configService.REDIS_STREAM_GROUPNAME,
      ...ids,
    );

    return processedMessagesNumber;
  }
}
