import { Injectable } from '@nestjs/common';

import { MessageBrokerPort } from '@app/ports/message-broker';
import { KafkaMessageBrokerHandler } from '@app/handlers/message-broker-handler';

import { UserKafkaClient } from '@users/infrastructure/clients/message-bus';

@Injectable()
export class KafkaMessageBrokerAdapter implements MessageBrokerPort {
  public constructor(
    private readonly kafkaMessageBrokerHandler: KafkaMessageBrokerHandler,
    private readonly kafkaClient: UserKafkaClient,
  ) {}

  public async publishMessage(topic: string, payload: string): Promise<void> {
    const kafkaPublishMessageOperation = () =>
      this.kafkaClient.producer.send({
        topic,
        messages: [{ key: 'xyz', value: payload }],
      });

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
      this.kafkaClient.consumer.subscribe({ topic, fromBeginning: true });
    await this.kafkaMessageBrokerHandler.execute(kafkaSubscribeOperation, {
      operationType: 'SUBSCRIBE',
      topic,
      logErrors: true,
      suppressErrors: false,
    });
  }
}
