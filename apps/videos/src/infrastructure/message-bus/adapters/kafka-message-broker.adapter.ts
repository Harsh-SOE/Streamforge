import { Injectable } from '@nestjs/common';

import { KafkaClient } from '@app/clients/kafka';
import { MessageBrokerPort } from '@app/ports/message-broker';
import { KafkaMessageBusHandler } from '@app/handlers/message-bus-handler';

@Injectable()
export class KafkaMessageBrokerAdapter implements MessageBrokerPort {
  public constructor(
    private readonly videosKafkaClient: KafkaClient,
    private readonly kafkaFilter: KafkaMessageBusHandler,
  ) {}

  public async publishMessage(topic: string, payload: string): Promise<void> {
    const kafkaPublishMessageOperation = () =>
      this.videosKafkaClient.producer.send({
        topic,
        messages: [{ key: 'videos', value: payload }],
      });

    await this.kafkaFilter.handle(kafkaPublishMessageOperation, {
      operationType: 'PUBLISH_OR_SEND',
      topic,
      message: String(payload),
      logErrors: true,
      suppressErrors: false,
    });
  }

  public async subscribeTo(topic: string): Promise<void> {
    const kafkaSubscribeOperation = () =>
      this.videosKafkaClient.consumer.subscribe({ topic, fromBeginning: true });
    await this.kafkaFilter.handle(kafkaSubscribeOperation, {
      operationType: 'SUBSCRIBE',
      topic,
      logErrors: true,
      suppressErrors: false,
    });
  }
}
