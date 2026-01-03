import { Consumer, EachBatchPayload, KafkaMessage, Producer } from 'kafkajs';
import { Inject, Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';

import {
  UsersBufferPort,
  USER_REROSITORY_PORT,
  UserRepositoryPort,
} from '@users/application/ports';
import { KafkaClient } from '@app/clients/kafka';
import { BUFFER_EVENTS } from '@app/common/events';
import { LOGGER_PORT, LoggerPort } from '@app/common/ports/logger';

import { UserAggregate } from '@users/domain/aggregates';

import { UserMessage } from '../types';

@Injectable()
export class UsersKafkaBuffer implements UsersBufferPort, OnModuleInit, OnModuleDestroy {
  private consumer: Consumer;
  private producer: Producer;

  public constructor(
    @Inject(USER_REROSITORY_PORT)
    private readonly userRepository: UserRepositoryPort,
    @Inject(LOGGER_PORT) private readonly logger: LoggerPort,
    private readonly kafka: KafkaClient,
  ) {
    this.consumer = this.kafka.getConsumer({ groupId: 'users' });
    this.producer = this.kafka.getProducer({ allowAutoTopicCreation: true });
    this.logger.alert(`Using kafka as buffer for users service`);
  }

  public async connect(): Promise<void> {
    await this.producer.connect();
    await this.consumer.connect();
  }

  public async disconnect(): Promise<void> {
    await this.producer.disconnect();
    await this.consumer.disconnect();
  }

  public async onModuleInit() {
    await this.connect();

    await this.consumer.subscribe({
      topic: BUFFER_EVENTS.USER_BUFFER_EVENT,
      fromBeginning: false,
    });

    await this.consumer.run({
      eachBatch: async (payload: EachBatchPayload) => {
        const { batch } = payload;

        if (batch.topic !== BUFFER_EVENTS.USER_BUFFER_EVENT.toString()) {
          return;
        }

        await this.processUsersMessages(batch.messages);
      },
    });
  }

  public async onModuleDestroy() {
    await this.disconnect();
  }

  public async bufferUser(user: UserAggregate): Promise<void> {
    await this.producer.send({
      topic: BUFFER_EVENTS.USER_BUFFER_EVENT,
      messages: [{ value: JSON.stringify(user.getUserSnapshot()) }],
    });
  }

  private async processUsersMessages(messages: KafkaMessage[]) {
    const usersMessages = messages
      .filter((message) => message.value)
      .map((message) => JSON.parse(message.value!.toString()) as UserMessage);

    const models = usersMessages.map((message) => {
      return UserAggregate.create({
        id: message.id,
        email: message.email,
        handle: message.handle,
        avatarUrl: message.avatarUrl,
        userAuthId: message.userAuthId,
        dob: message.dob ? new Date(message.dob) : undefined,
        phoneNumber: message.phoneNumber,
        isPhoneNumberVerified: message.isPhoneNumbetVerified,
        notification: message.notification,
        preferredLanguage: message.languagePreference,
        preferredTheme: message.themePreference,
        region: message.region,
      });
    });

    this.logger.info(`Saving ${models.length} likes in database`);

    await this.userRepository.saveManyUsers(models);

    this.logger.info(`${models.length} likes saved in database`);
  }
}
