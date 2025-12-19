import { Injectable } from '@nestjs/common';

import { KafkaClient } from '@app/clients/kafka';
import { MessageBrokerPort } from '@app/ports/message-broker';
import { KafkaMessageBusHandler } from '@app/handlers/message-bus-handler';

@Injectable()
export class KafkaMessageBrokerAdapter implements MessageBrokerPort {
  public constructor(
    private readonly kafkaMessageBrokerHandler: KafkaMessageBusHandler,
    private readonly kafka: KafkaClient,
  ) {}

  public async publishMessage(topic: string, payload: string): Promise<void> {
    const kafkaPublishMessageOperation = () =>
      this.kafka.producer.send({ topic, messages: [{ key: 'xyz', value: payload }] });

    await this.kafkaMessageBrokerHandler.handle(kafkaPublishMessageOperation, {
      operationType: 'PUBLISH_OR_SEND',
      topic,
      message: String(payload),
      logErrors: true,
      suppressErrors: false,
    });
  }

  public async subscribeTo(topic: string): Promise<void> {
    const kafkaSubscribeOperation = () =>
      this.kafka.consumer.subscribe({ topic, fromBeginning: true });
    await this.kafkaMessageBrokerHandler.handle(kafkaSubscribeOperation, {
      operationType: 'SUBSCRIBE',
      topic,
      logErrors: true,
      suppressErrors: false,
    });
  }
}
