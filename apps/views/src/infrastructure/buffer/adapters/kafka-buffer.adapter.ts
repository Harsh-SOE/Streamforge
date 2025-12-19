import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { EachBatchPayload } from 'kafkajs';

import { KafkaClient } from '@app/clients/kafka';
import { LOGGER_PORT, LoggerPort } from '@app/ports/logger';

import {
  ViewsBufferPort,
  ViewRepositoryPort,
  VIEWS_REPOSITORY_PORT,
} from '@views/application/ports';
import { ViewAggregate } from '@views/domain/aggregates';

import { ViewMessage } from '../types';

export const VIEW_BUFFER_TOPIC = 'views';

@Injectable()
export class KafkaBufferAdapter implements OnModuleInit, ViewsBufferPort {
  public constructor(
    @Inject(VIEWS_REPOSITORY_PORT)
    private readonly viewsRepo: ViewRepositoryPort,
    private readonly kafka: KafkaClient,
    @Inject(LOGGER_PORT) private readonly logger: LoggerPort,
  ) {}

  public async onModuleInit() {
    await this.kafka.consumer.subscribe({
      topic: VIEW_BUFFER_TOPIC,
      fromBeginning: false,
    });
  }

  public async bufferView(like: ViewAggregate): Promise<void> {
    await this.kafka.producer.send({
      topic: VIEW_BUFFER_TOPIC,
      messages: [{ value: JSON.stringify(like.getSnapshot()) }],
    });
  }

  public async processViewsBatch(): Promise<number | void> {
    await this.kafka.consumer.run({
      eachBatch: async (payload: EachBatchPayload) => {
        const { batch } = payload;
        const messages = batch.messages
          .filter((message) => message.value)
          .map((message) => JSON.parse(message.value!.toString()) as ViewMessage);

        const models = messages.map((message) => {
          return ViewAggregate.create({ userId: message.userId, videoId: message.videoId });
        });

        this.logger.info(`Saving ${models.length} view in database`);

        await this.viewsRepo.saveMany(models);

        this.logger.info(`${models.length} view saved in database`);
      },
    });
  }
}
