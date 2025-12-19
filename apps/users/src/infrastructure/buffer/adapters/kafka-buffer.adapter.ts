import { EachBatchPayload } from 'kafkajs';
import { Inject, Injectable } from '@nestjs/common';

import { KafkaClient } from '@app/clients/kafka';
import { LOGGER_PORT, LoggerPort } from '@app/ports/logger';

import {
  UsersBufferPort,
  USER_REROSITORY_PORT,
  UserRepositoryPort,
} from '@users/application/ports';
import { UserAggregate } from '@users/domain/aggregates';

import { UserMessage } from '../types';

export const USER_BUFFER_TOPIC = 'users';

@Injectable()
export class UsersKafkaBuffer implements UsersBufferPort {
  public constructor(
    @Inject(USER_REROSITORY_PORT)
    private readonly userRepository: UserRepositoryPort,
    @Inject(LOGGER_PORT) private readonly logger: LoggerPort,
    private readonly userKafkaClient: KafkaClient,
  ) {
    this.logger.alert(`Using kafka as buffer for users service`);
  }

  public async onModuleInit() {
    await this.userKafkaClient.consumer.subscribe({
      topic: USER_BUFFER_TOPIC,
      fromBeginning: false,
    });
  }

  public async bufferUser(user: UserAggregate): Promise<void> {
    await this.userKafkaClient.producer.send({
      topic: USER_BUFFER_TOPIC,
      messages: [{ value: JSON.stringify(user.getUserSnapshot()) }],
    });
  }

  public async processUsersBatch(): Promise<number | void> {
    await this.userKafkaClient.consumer.run({
      eachBatch: async (payload: EachBatchPayload) => {
        const { batch } = payload;
        const messages = batch.messages
          .filter((message) => message.value)
          .map((message) => JSON.parse(message.value!.toString()) as UserMessage);

        const models = messages.map((message) => {
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
      },
    });
  }
}
