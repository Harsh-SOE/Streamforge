import { EachBatchPayload } from 'kafkajs';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';

import { KafkaClient } from '@app/clients/kafka';
import { CommentMessage } from '@app/common/types';
import { LOGGER_PORT, LoggerPort } from '@app/ports/logger';

import {
  CommentBufferPort,
  COMMENTS_REPOSITORY_PORT,
  CommentRepositoryPort,
} from '@comments/application/ports';
import { CommentAggregate } from '@comments/domain/aggregates';

export const COMMENT_BUFFER_TOPIC = 'comment';

@Injectable()
export class KafkaBufferAdapter implements OnModuleInit, CommentBufferPort {
  public constructor(
    @Inject(COMMENTS_REPOSITORY_PORT)
    private readonly commentsRepo: CommentRepositoryPort,
    @Inject(LOGGER_PORT) private readonly logger: LoggerPort,
    private readonly kafka: KafkaClient,
  ) {}

  public async onModuleInit() {
    await this.kafka.consumer.subscribe({
      topic: COMMENT_BUFFER_TOPIC,
      fromBeginning: false,
    });
  }

  public async bufferComment(comment: CommentAggregate): Promise<void> {
    await this.kafka.producer.send({
      topic: COMMENT_BUFFER_TOPIC,
      messages: [{ value: JSON.stringify(comment.getSnapshot()) }],
    });
  }

  public async processCommentsBatch(): Promise<number | void> {
    await this.kafka.consumer.run({
      eachBatch: async (payload: EachBatchPayload) => {
        const { batch } = payload;
        const messages = batch.messages
          .filter((message) => message.value)
          .map((message) => JSON.parse(message.value!.toString()) as CommentMessage);

        const models = messages.map((message) =>
          CommentAggregate.create({
            userId: message.userId,
            videoId: message.videoId,
            commentText: message.commentText,
          }),
        );

        this.logger.info(`Saving ${models.length} comments in database`);

        await this.commentsRepo.saveMany(models);

        this.logger.info(`${models.length} comments saved in database`);
      },
    });
  }
}
