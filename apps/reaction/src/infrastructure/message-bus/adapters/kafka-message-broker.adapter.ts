import { Injectable } from '@nestjs/common';

import { KafkaClient } from '@app/clients/kafka';
import { MessageBusPort } from '@app/ports/message-broker';
import { KafkaHandler } from '@app/handlers/kafka-bus-handler';

@Injectable()
export class KafkaMessageBusAdapter implements MessageBusPort {
  public constructor(
    private readonly kafkaMessageBusHandler: KafkaHandler,
    private readonly kafka: KafkaClient,
  ) {}

  public async publishMessage(topic: string, payload: string): Promise<void> {
    const kafkaPublishMessageOperation = () =>
      this.kafka.producer.send({ topic, messages: [{ key: 'reaction', value: payload }] });

    await this.kafkaMessageBusHandler.execute(kafkaPublishMessageOperation, {
      operationType: 'PUBLISH_OR_SEND',
      topic,
      message: String(payload),
    });
  }

  public async subscribeTo(topic: string): Promise<void> {
    const kafkaSubscribeOperation = () =>
      this.kafka.consumer.subscribe({ topic, fromBeginning: true });
    await this.kafkaMessageBusHandler.execute(kafkaSubscribeOperation, {
      operationType: 'SUBSCRIBE',
      topic,
    });
  }
}
