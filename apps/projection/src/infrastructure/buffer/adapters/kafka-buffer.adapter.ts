import { Consumer, EachBatchPayload, KafkaMessage, Producer } from 'kafkajs';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';

import { KafkaClient } from '@app/clients/kafka';
import { VideoUploadedEventDto } from '@app/contracts/videos';
import { UserProfileCreatedEventDto } from '@app/contracts/users';
import { LOGGER_PORT, LoggerPort } from '@app/common/ports/logger';
import { IntegrationEvent, PROJECTION_EVENTS } from '@app/common/events';
import { KafkaEventConsumerHandler } from '@app/handlers/events-consumer/kafka';
import { KafkaEventPublisherHandler } from '@app/handlers/events-publisher/kafka';

import {
  USER_PROJECTION_REPOSITORY_PORT,
  ProjectionBufferPort,
  UserProjectionRepositoryPort,
  VIDEO_PROJECTION_REPOSITORY_PORT,
  VideoProjectionRepositoryPort,
} from '@projection/application/ports';
import { ProjectionConfigService } from '@projection/infrastructure/config';

@Injectable()
export class KafkaBufferAdapter implements OnModuleInit, ProjectionBufferPort {
  private consumer: Consumer;
  private producer: Producer;

  public constructor(
    private readonly configService: ProjectionConfigService,
    @Inject(USER_PROJECTION_REPOSITORY_PORT)
    private readonly userProjectionRepo: UserProjectionRepositoryPort,
    @Inject(VIDEO_PROJECTION_REPOSITORY_PORT)
    private readonly videoProjectionRepo: VideoProjectionRepositoryPort,
    @Inject(LOGGER_PORT) private readonly logger: LoggerPort,
    private readonly kafka: KafkaClient,
    private readonly consumerhandler: KafkaEventConsumerHandler,
    private readonly publisherhandler: KafkaEventPublisherHandler,
  ) {
    this.consumer = kafka.getConsumer({ groupId: 'projection', allowAutoTopicCreation: true });
    this.producer = kafka.getProducer({ allowAutoTopicCreation: true });
  }

  public async onModuleInit() {
    const userSubscribeOperation = async () =>
      await this.consumer.subscribe({
        topic: PROJECTION_EVENTS.SAVE_USER_EVENT,
        fromBeginning: false,
      });

    const videosubscribeOperation = async () =>
      await this.consumer.subscribe({
        topic: PROJECTION_EVENTS.SAVE_VIDEO_EVENT,
        fromBeginning: false,
      });

    await this.consumerhandler.execute(userSubscribeOperation, {
      operationType: 'CONNECT',
    });

    await this.consumerhandler.execute(videosubscribeOperation, {
      operationType: 'CONNECT',
    });

    await this.consumer.run({
      eachBatch: async (payload: EachBatchPayload) => {
        const { batch } = payload;

        const topic = batch.topic;
        switch (topic) {
          case PROJECTION_EVENTS.SAVE_USER_EVENT.toString():
            await this.handleUserBatch(batch.messages);
            break;

          case PROJECTION_EVENTS.SAVE_VIDEO_EVENT.toString():
            await this.handleVideoBatch(batch.messages);
            break;

          default:
            this.logger.alert(`Received batch for unknown topic: ${batch.topic}`);
        }
      },
    });
  }

  async bufferUser(event: IntegrationEvent<any>): Promise<void> {
    await this.publisherhandler.execute(
      async () =>
        await this.producer.send({
          topic: PROJECTION_EVENTS.SAVE_USER_EVENT,
          messages: [{ value: JSON.stringify(event) }],
        }),
      {
        operationType: 'PUBLISH',
        topic: PROJECTION_EVENTS.SAVE_USER_EVENT,
        message: event,
      },
    );
  }

  private async handleUserBatch(messages: KafkaMessage[]) {
    const userEvents = messages
      .filter((msg) => msg.value)
      .map((msg) => JSON.parse(msg.value!.toString()) as UserProfileCreatedEventDto);

    if (userEvents.length > 0) {
      this.logger.info(`Saving ${userEvents.length} users to projection`);
      await this.userProjectionRepo.saveManyUser(userEvents);
    }
  }

  private async handleVideoBatch(messages: KafkaMessage[]) {
    const videoEvents = messages
      .filter((msg) => msg.value)
      .map((msg) => JSON.parse(msg.value!.toString()) as VideoUploadedEventDto);

    if (videoEvents.length > 0) {
      this.logger.info(`Saving ${videoEvents.length} videos to projection`);
      await this.videoProjectionRepo.saveManyVideos(videoEvents);
    }
  }

  async bufferVideo(event: IntegrationEvent<any>): Promise<void> {
    await this.publisherhandler.execute(
      async () =>
        await this.producer.send({
          topic: PROJECTION_EVENTS.SAVE_VIDEO_EVENT,
          messages: [{ value: JSON.stringify(event) }],
        }),
      {
        operationType: 'PUBLISH',
        topic: PROJECTION_EVENTS.SAVE_USER_EVENT,
        message: event,
      },
    );
  }
}
