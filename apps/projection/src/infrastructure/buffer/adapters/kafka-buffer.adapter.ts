import { EachBatchPayload } from 'kafkajs';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';

import { LOGGER_PORT, LoggerPort } from '@app/ports/logger';
import { VideoUploadedEventDto } from '@app/contracts/videos';
import { UserProfileCreatedEventDto } from '@app/contracts/users';
import { KafkaMessageBusHandler } from '@app/handlers/message-bus-handler';

import {
  USER_PROJECTION_REPOSITORY_PORT,
  ProjectionBufferPort,
  UserProjectionRepositoryPort,
  VIDEO_PROJECTION_REPOSITORY_PORT,
  VideoProjectionRepositoryPort,
} from '@projection/application/ports';
import { AppConfigService } from '@projection/infrastructure/config';
import { KafkaClient } from '@app/clients/kafka';

export const USER_PROFILE_PROJECTION_BUFFER_TOPIC = 'user.profile-created-projection-topic';
export const VIDEO_PROJECTION_BUFFER_TOPIC = 'video.projection-event';

@Injectable()
export class KafkaBufferAdapter implements OnModuleInit, ProjectionBufferPort {
  public constructor(
    private readonly configService: AppConfigService,
    @Inject(USER_PROJECTION_REPOSITORY_PORT)
    private readonly userProjectionRepo: UserProjectionRepositoryPort,
    @Inject(VIDEO_PROJECTION_REPOSITORY_PORT)
    private readonly videoProjectionRepo: VideoProjectionRepositoryPort,
    @Inject(LOGGER_PORT) private readonly logger: LoggerPort,
    private readonly kafkaClient: KafkaClient,
    private readonly kafkaHandler: KafkaMessageBusHandler,
  ) {}

  public async onModuleInit() {
    await this.kafkaClient.consumer.subscribe({
      topic: USER_PROFILE_PROJECTION_BUFFER_TOPIC,
      fromBeginning: false,
    });

    const userSubscribeOperation = async () =>
      await this.kafkaClient.consumer.subscribe({
        topic: USER_PROFILE_PROJECTION_BUFFER_TOPIC,
        fromBeginning: false,
      });

    const videosubscribeOperation = async () =>
      await this.kafkaClient.consumer.subscribe({
        topic: VIDEO_PROJECTION_BUFFER_TOPIC,
        fromBeginning: false,
      });

    await this.kafkaHandler.handle(userSubscribeOperation, {
      operationType: 'CONNECT_OR_DISCONNECT',
    });

    await this.kafkaHandler.handle(videosubscribeOperation, {
      operationType: 'CONNECT_OR_DISCONNECT',
    });
  }

  async bufferUser(event: UserProfileCreatedEventDto): Promise<void> {
    await this.kafkaClient.producer.send({
      topic: USER_PROFILE_PROJECTION_BUFFER_TOPIC,
      messages: [{ value: JSON.stringify(event) }],
    });
  }

  async processUser(): Promise<number | void> {
    await this.kafkaClient.consumer.run({
      eachBatch: async (payload: EachBatchPayload) => {
        const { batch } = payload;
        const messages = batch.messages
          .filter((message) => message.value)
          .map((message) => JSON.parse(message.value!.toString()) as UserProfileCreatedEventDto);

        this.logger.info(`Saving ${messages.length} profiles in projection database`);

        await this.userProjectionRepo.saveManyUser(messages);

        this.logger.info(`${messages.length} profiles in projection database`);
      },
    });
  }

  async bufferVideo(event: VideoUploadedEventDto): Promise<void> {
    await this.kafkaClient.producer.send({
      topic: VIDEO_PROJECTION_BUFFER_TOPIC,
      messages: [{ value: JSON.stringify(event) }],
    });
  }

  async processVideos(): Promise<number | void> {
    await this.kafkaClient.consumer.run({
      eachBatch: async (payload: EachBatchPayload) => {
        const { batch } = payload;
        const messages = batch.messages
          .filter((message) => message.value)
          .map((message) => JSON.parse(message.value!.toString()) as VideoUploadedEventDto);

        this.logger.info(`Saving ${messages.length} profiles in projection database`);

        await this.videoProjectionRepo.saveManyVideos(messages);

        this.logger.info(`${messages.length} profiles in projection database`);
      },
    });
  }
}
