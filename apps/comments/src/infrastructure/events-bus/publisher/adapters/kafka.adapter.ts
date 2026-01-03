import { Producer } from 'kafkajs';
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';

import { KafkaClient } from '@app/clients/kafka';
import { IntegrationEvent } from '@app/common/events';
import { EventsPublisher } from '@app/common/ports/events';
import { KafkaEventPublisherHandler } from '@app/handlers/event-bus-handler/kafka/publisher-handler';

@Injectable()
export class UsersKafkaPublisherAdapter implements EventsPublisher, OnModuleInit, OnModuleDestroy {
  private readonly producer: Producer;

  public constructor(
    private readonly handler: KafkaEventPublisherHandler,
    private readonly kafka: KafkaClient,
  ) {
    this.producer = kafka.getProducer({ allowAutoTopicCreation: true });
  }

  public async connect(): Promise<void> {
    await this.producer.connect();
  }

  public async disconnect(): Promise<void> {
    await this.producer.disconnect();
  }

  public async onModuleInit() {
    await this.connect();
  }

  public async onModuleDestroy() {
    await this.disconnect();
  }

  public async publishMessage(message: IntegrationEvent<any>): Promise<void> {
    const sendMessageOperation = async () =>
      await this.producer.send({
        topic: message.eventName,
        messages: [{ key: message.eventId, value: JSON.stringify(message) }],
      });

    await this.handler.execute(sendMessageOperation, {
      operationType: 'PUBLISH',
      topic: message.eventName,
      message,
    });
  }
}
