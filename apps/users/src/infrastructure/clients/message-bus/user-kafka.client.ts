import { Consumer, Kafka, Producer } from 'kafkajs';
import { Inject, Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';

import { LOGGER_PORT, LoggerPort } from '@app/ports/logger';
import { KafkaMessageBrokerHandler } from '@app/handlers/message-broker-handler';

import { AppConfigService } from '@users/infrastructure/config';

@Injectable()
export class UserKafkaClient implements OnModuleInit, OnModuleDestroy {
  private client: Kafka;
  public readonly producer: Producer;
  public readonly consumer: Consumer;

  public constructor(
    private readonly configService: AppConfigService,
    private readonly kafkaMessageHandler: KafkaMessageBrokerHandler,
    @Inject(LOGGER_PORT) private readonly loggerAdapter: LoggerPort,
  ) {
    this.client = new Kafka({
      brokers: [`${configService.MESSAGE_BROKER_HOST}:${configService.MESSAGE_BROKER_PORT}`],
      clientId: configService.USER_CLIENT_ID,
    });

    this.producer = this.client.producer({ allowAutoTopicCreation: true });

    this.consumer = this.client.consumer({
      groupId: this.configService.USER_CONSUMER_ID,
    });
  }

  public async onModuleInit() {
    const producerConnectOperation = async () => await this.producer.connect();
    const consumerConnectOperation = async () => await this.consumer.connect();

    await this.kafkaMessageHandler.execute(producerConnectOperation, {
      operationType: 'CONNECT_OR_DISCONNECT',
    });

    await this.kafkaMessageHandler.execute(consumerConnectOperation, {
      operationType: 'CONNECT_OR_DISCONNECT',
    });

    this.loggerAdapter.info(`Kafka connected successfully`);
  }

  public async onModuleDestroy() {
    const producerDisconnectOperation = async () => await this.producer.disconnect();
    const consumerDisconnectOperation = async () => await this.consumer.disconnect();

    await this.kafkaMessageHandler.execute(producerDisconnectOperation, {
      operationType: 'CONNECT_OR_DISCONNECT',
    });

    await this.kafkaMessageHandler.execute(consumerDisconnectOperation, {
      operationType: 'CONNECT_OR_DISCONNECT',
    });

    this.loggerAdapter.info(`Kafka disconnected successfully`);
  }
}
