import { Inject, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { LOGGER_PORT, LoggerPort } from '@app/ports/logger';

import {
  ReactionBufferPort,
  REACTION_DATABASE_PORT,
  ReactionRepositoryPort,
} from '@reaction/application/ports';
import { ReactionAggregate } from '@reaction/domain/aggregates';
import { ReactionConfigService } from '@reaction/infrastructure/config';
import { TransportDomainReactionStatusEnumMapper } from '@reaction/infrastructure/anti-corruption';

import { ReactionMessage, StreamData } from '../types';
import { RedisClient } from '@app/clients/redis';

@Injectable()
export class RedisStreamBufferAdapter implements ReactionBufferPort {
  public constructor(
    private readonly configService: ReactionConfigService,
    @Inject(LOGGER_PORT) private readonly logger: LoggerPort,
    @Inject(REACTION_DATABASE_PORT)
    private readonly reactionRepo: ReactionRepositoryPort,
    private readonly redis: RedisClient,
  ) {}

  public async bufferReaction(reaction: ReactionAggregate): Promise<void> {
    await this.redis.client.xadd(
      this.configService.REDIS_STREAM_KEY,
      '*',
      'reaction-message',
      JSON.stringify(reaction.getEntity().getSnapshot()),
    );
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  public async processReactionsBatch() {
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
    const messages: ReactionMessage[] = [];
    const ids: string[] = [];
    for (const [streamKey, entities] of stream) {
      this.logger.info(`Processing stream: ${streamKey}`);
      for (const [id, message] of entities) {
        this.logger.info(`Recieved an element with id:${id}`);
        ids.push(id);
        messages.push(JSON.parse(message[1]) as ReactionMessage);
      }
    }
    return { ids: ids, extractedMessages: messages };
  }

  public async processMessages(ids: string[], messages: ReactionMessage[]) {
    const models = messages.map((message) => {
      const reactionStatus = TransportDomainReactionStatusEnumMapper[message.reactionStatus];
      return ReactionAggregate.create({
        userId: message.userId,
        videoId: message.videoId,
        reactionStatus,
      });
    });

    const processedMessagesNumber = await this.reactionRepo.saveManyReaction(models);

    await this.redis.client.xack(
      this.configService.REDIS_STREAM_KEY,
      this.configService.REDIS_STREAM_GROUPNAME,
      ...ids,
    );

    return processedMessagesNumber;
  }
}
