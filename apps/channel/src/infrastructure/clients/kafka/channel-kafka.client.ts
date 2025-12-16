import { Consumer, Kafka, Producer } from 'kafkajs';
import { Inject, Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';

import { LOGGER_PORT, LoggerPort } from '@app/ports/logger';
import { KafkaMessageBrokerHandler } from '@app/handlers/message-broker-handler';

import { AppConfigService } from '@channel/infrastructure/config';

@Injectable()
export class ChannelKafkaClient implements OnModuleInit, OnModuleDestroy {
  public readonly kafkaClient: Kafka;
  public readonly consumer: Consumer;
  public readonly producer: Producer;

  public constructor(
    private readonly configService: AppConfigService,
    private readonly kafkaMessageHandler: KafkaMessageBrokerHandler,
    @Inject(LOGGER_PORT) private readonly loggerAdapter: LoggerPort,
  ) {
    this.kafkaClient = new Kafka({
      brokers: [`${configService.MESSAGE_BROKER_HOST}:${configService.MESSAGE_BROKER_PORT}`],
      clientId: configService.CHANNEL_CLIENT_ID,
    });

    this.producer = this.kafkaClient.producer({ allowAutoTopicCreation: true });
    this.consumer = this.kafkaClient.consumer({
      groupId: this.configService.CHANNEL_CONSUMER_ID,
      maxWaitTimeInMs: this.configService.BUFFER_FLUSH_MAX_WAIT_TIME_MS,
      maxBytesPerPartition: 512_000,
      sessionTimeout: 30_000,
      heartbeatInterval: 3_000,
      retry: {
        initialRetryTime: 100,
        retries: 8,
      },
    });
  }

  public async onModuleInit() {
    const producerConnectionOperation = async () => await this.producer.connect();
    const consumerConnectionOperation = async () => await this.consumer.connect();

    await this.kafkaMessageHandler.execute(producerConnectionOperation, {
      operationType: 'CONNECT_OR_DISCONNECT',
    });

    await this.kafkaMessageHandler.execute(consumerConnectionOperation, {
      operationType: 'CONNECT_OR_DISCONNECT',
    });

    this.loggerAdapter.info(`Kafka connected successfully`);
  }

  public async onModuleDestroy() {
    const kafkaProducerDisconnectionOperation = async () => await this.producer.disconnect();
    const kafkaConsumerDisconnectionOperation = async () => await this.consumer.disconnect();

    await this.kafkaMessageHandler.execute(kafkaProducerDisconnectionOperation, {
      operationType: 'CONNECT_OR_DISCONNECT',
    });

    await this.kafkaMessageHandler.execute(kafkaConsumerDisconnectionOperation, {
      operationType: 'CONNECT_OR_DISCONNECT',
    });

    this.loggerAdapter.info(`Kafka disconnected successfully`);
  }
}
