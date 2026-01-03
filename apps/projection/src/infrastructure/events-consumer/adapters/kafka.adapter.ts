import { Consumer } from 'kafkajs';
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';

import { KafkaClient } from '@app/clients/kafka';
import { CHANNEL_EVENTS, IntegrationEvent, USERS_EVENTS, VIDEO_EVENTS } from '@app/common/events';
import { EventsConsumerPort } from '@app/common/ports/events';
import { KafkaEventConsumerHandler } from '@app/handlers/events-consumer/kafka';

import { ProjectionConfigService } from '@projection/infrastructure/config';

@Injectable()
export class ProjectionKafkaConsumerAdapter
  implements EventsConsumerPort, OnModuleInit, OnModuleDestroy
{
  private readonly consumer: Consumer;

  public constructor(
    private readonly configService: ProjectionConfigService,
    private readonly handler: KafkaEventConsumerHandler,
    private readonly kafka: KafkaClient,
  ) {
    this.consumer = kafka.getConsumer({
      groupId: 'comments',
    });
  }

  public async onModuleInit() {
    await this.handler.execute(async () => await this.connect(), { operationType: 'CONNECT' });
  }

  public async onModuleDestroy() {
    await this.handler.execute(async () => await this.disconnect(), {
      operationType: 'DISCONNECT',
    });
  }

  public async connect(): Promise<void> {
    await this.consumer.connect();
    await this.consumer.subscribe({
      topics: [
        USERS_EVENTS.USER_ONBOARDED_EVENT,
        USERS_EVENTS.USER_PROFILE_UPDATED_EVENT,
        VIDEO_EVENTS.VIDEO_UPLOADED_EVENT,
        CHANNEL_EVENTS.CHANNEL_CREATED,
      ].map((event) => event.toString()),
      fromBeginning: this.configService.NODE_ENVIRONMENT === 'development',
    });
  }

  public async disconnect(): Promise<void> {
    await this.consumer.disconnect();
  }

  public async consumeMessage(
    onConsumeMessageHandler: (message: IntegrationEvent<any>) => Promise<void>,
  ): Promise<void> {
    await this.consumer.run({
      eachMessage: async ({ topic, message }) => {
        if (!message.value) {
          return;
        }

        const eventMessage = JSON.parse(message.value.toString()) as IntegrationEvent<any>;

        const consumeMessageOperation = async () => await onConsumeMessageHandler(eventMessage);

        await this.handler.execute(consumeMessageOperation, {
          operationType: 'CONSUME',
          topic,
          message: eventMessage,
        });
      },
    });
  }
}
