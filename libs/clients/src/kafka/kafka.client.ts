import { Consumer, Kafka, Producer } from 'kafkajs';
import { Inject, Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';

import { LOGGER_PORT, LoggerPort } from '@app/ports/logger';
import { KafkaMessageBusHandler } from '@app/handlers/message-bus-handler';

export const KAFKA_HOST = Symbol('KAFKA_HOST');
export const KAFKA_PORT = Symbol('KAFKA_PORT');
export const KAFKA_CLIENT = Symbol('KAFKA_CLIENT');
export const KAFKA_CONSUMER = Symbol('KAFKA_CONSUMER');

@Injectable()
export class KafkaClient implements OnModuleInit, OnModuleDestroy {
  private client: Kafka;
  public producer: Producer;
  public consumer: Consumer;

  public constructor(
    @Inject(KAFKA_HOST) private readonly kafkaHost: string,
    @Inject(KAFKA_PORT) private readonly kafkaPort: number,
    @Inject(KAFKA_CLIENT) private readonly kafkaClient: string,
    @Inject(KAFKA_CONSUMER) private readonly kafkaConsumer: string,
    @Inject(LOGGER_PORT) private readonly logger: LoggerPort,
    private readonly kafkaMessageHandler: KafkaMessageBusHandler,
  ) {
    this.logger.alert(`Kafka client connecting...`);
  }

  public async onModuleInit() {
    const kafkaInitializationOperation = () => {
      this.client = new Kafka({
        brokers: [`${this.kafkaHost}:${this.kafkaPort}`],
        clientId: this.kafkaClient,
      });

      this.producer = this.client.producer({ allowAutoTopicCreation: true });

      this.consumer = this.client.consumer({
        groupId: this.kafkaConsumer,
      });
    };

    const producerConnectOperation = async () => await this.producer.connect();
    const consumerConnectOperation = async () => await this.consumer.connect();

    await this.kafkaMessageHandler.handle(kafkaInitializationOperation, {
      operationType: 'CONNECT_OR_DISCONNECT',
    });

    await this.kafkaMessageHandler.handle(producerConnectOperation, {
      operationType: 'CONNECT_OR_DISCONNECT',
    });

    await this.kafkaMessageHandler.handle(consumerConnectOperation, {
      operationType: 'CONNECT_OR_DISCONNECT',
    });

    this.logger.alert(`Kafka client connected successfully`);
  }

  public async onModuleDestroy() {
    const producerDisconnectOperation = async () => await this.producer.disconnect();
    const consumerDisconnectOperation = async () => await this.consumer.disconnect();

    await this.kafkaMessageHandler.handle(producerDisconnectOperation, {
      operationType: 'CONNECT_OR_DISCONNECT',
    });

    await this.kafkaMessageHandler.handle(consumerDisconnectOperation, {
      operationType: 'CONNECT_OR_DISCONNECT',
    });

    this.logger.alert(`Kafka client disconnected successfully`);
  }
}
