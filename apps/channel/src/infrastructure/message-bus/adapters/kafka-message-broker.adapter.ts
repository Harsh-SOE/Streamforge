import { Injectable } from '@nestjs/common';

import { MessageBrokerPort } from '@app/ports/message-broker';
import { KafkaMessageBrokerHandler } from '@app/handlers/message-broker-handler';

import { AppConfigService } from '@channel/infrastructure/config';
import { ChannelKafkaClient } from '@channel/infrastructure/clients/kafka';

@Injectable()
export class KafkaMessageBrokerAdapter implements MessageBrokerPort {
  public constructor(
    private readonly configService: AppConfigService,
    private readonly kafkaMessageBrokerHandler: KafkaMessageBrokerHandler,
    private readonly channelKafkaClient: ChannelKafkaClient,
  ) {}

  public async publishMessage(topic: string, payload: string): Promise<void> {
    const kafkaPublishMessageOperation = () =>
      this.channelKafkaClient.producer.send({ topic, messages: [{ key: 'xyz', value: payload }] });

    await this.kafkaMessageBrokerHandler.execute(kafkaPublishMessageOperation, {
      operationType: 'PUBLISH_OR_SEND',
      topic,
      message: String(payload),
      logErrors: true,
      suppressErrors: false,
    });
  }

  public async subscribeTo(topic: string): Promise<void> {
    const kafkaSubscribeOperation = () =>
      this.channelKafkaClient.consumer.subscribe({ topic, fromBeginning: true });
    await this.kafkaMessageBrokerHandler.execute(kafkaSubscribeOperation, {
      operationType: 'SUBSCRIBE',
      topic,
      logErrors: true,
      suppressErrors: false,
    });
  }
}
