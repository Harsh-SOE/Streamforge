import { EachBatchPayload } from 'kafkajs';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';

import { LOGGER_PORT, LoggerPort } from '@app/ports/logger';

import {
  ReactionBufferPort,
  ReactionRepositoryPort,
  REACTION_DATABASE_PORT,
} from '@reaction/application/ports';
import { KafkaClient } from '@app/clients/kafka';
import { ReactionAggregate } from '@reaction/domain/aggregates';
import { AppConfigService } from '@reaction/infrastructure/config';
import { TransportDomainReactionStatusEnumMapper } from '@reaction/infrastructure/anti-corruption';

import { ReactionMessage } from '../types';

export const REACTION_BUFFER_TOPIC = 'reaction';

@Injectable()
export class KafkaBufferAdapter implements OnModuleInit, ReactionBufferPort {
  public constructor(
    private readonly configService: AppConfigService,
    private readonly kafka: KafkaClient,
    @Inject(REACTION_DATABASE_PORT)
    private readonly reactionsRepo: ReactionRepositoryPort,
    @Inject(LOGGER_PORT) private readonly logger: LoggerPort,
  ) {}

  public async onModuleInit() {
    await this.kafka.consumer.subscribe({
      topic: REACTION_BUFFER_TOPIC,
      fromBeginning: false,
    });
  }

  public async bufferReaction(reaction: ReactionAggregate): Promise<void> {
    await this.kafka.producer.send({
      topic: REACTION_BUFFER_TOPIC,
      messages: [{ value: JSON.stringify(reaction.getSnapshot()) }],
    });
  }

  public async processReactionsBatch(): Promise<number | void> {
    await this.kafka.consumer.run({
      eachBatch: async (payload: EachBatchPayload) => {
        const { batch } = payload;
        const messages = batch.messages
          .filter((message) => message.value)
          .map((message) => JSON.parse(message.value!.toString()) as ReactionMessage);

        const models = messages.map((message) => {
          const reactionStatus = TransportDomainReactionStatusEnumMapper[message.reactionStatus];
          return ReactionAggregate.create({
            userId: message.userId,
            videoId: message.videoId,
            reactionStatus,
          });
        });

        this.logger.info(`Saving ${models.length} reactions in database`);

        await this.reactionsRepo.saveManyReaction(models);

        this.logger.info(`${models.length} reactions saved in database`);
      },
    });
  }
}
