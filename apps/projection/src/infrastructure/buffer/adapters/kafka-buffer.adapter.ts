import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { EachBatchPayload } from 'kafkajs';

import { LOGGER_PORT, LoggerPort } from '@app/ports/logger';
import { UserProfileCreatedEventDto } from '@app/contracts/users';
import { KafkaMessageBrokerHandler } from '@app/handlers/message-broker-handler';

import {
  USER_PROJECTION_REPOSITORY_PORT,
  ProjectionBufferPort,
  UserProjectionRepositoryPort,
  VIDEO_PROJECTION_REPOSITORY_PORT,
  VideoProjectionRepositoryPort,
} from '@projection/application/ports';
import { AppConfigService } from '@projection/infrastructure/config';
import { ProjectionKafkaClient } from '@projection/infrastructure/clients/kafka';
import { VideoUploadedEventDto } from '@app/contracts/videos';

export const USER_PROFILE_PROJECTION_BUFFER_TOPIC = 'user_profile_created_projection_topic';
export const VIDEO_PROJECTION_BUFFER_TOPIC = 'video_projection_event';

@Injectable()
export class KafkaBufferAdapter implements OnModuleInit, ProjectionBufferPort {
  public constructor(
    private readonly configService: AppConfigService,
    @Inject(USER_PROJECTION_REPOSITORY_PORT)
    private readonly userProjectionRepo: UserProjectionRepositoryPort,
    @Inject(VIDEO_PROJECTION_REPOSITORY_PORT)
    private readonly videoProjectionRepo: VideoProjectionRepositoryPort,
    @Inject(LOGGER_PORT) private readonly logger: LoggerPort,
    private readonly kafkaClient: ProjectionKafkaClient,
    private readonly kafkaHandler: KafkaMessageBrokerHandler,
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

    await this.kafkaHandler.execute(userSubscribeOperation, {
      operationType: 'CONNECT_OR_DISCONNECT',
    });

    await this.kafkaHandler.execute(videosubscribeOperation, {
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
