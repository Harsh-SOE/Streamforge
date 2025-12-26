import { Injectable } from '@nestjs/common';

import { KafkaClient } from '@app/clients/kafka';
import { MessageBusPort } from '@app/ports/message-broker';
import { KafkaHandler } from '@app/handlers/kafka-bus-handler';

@Injectable()
export class KafkaMessageBusAdapter implements MessageBusPort {
  public constructor(
    private readonly videosKafkaClient: KafkaClient,
    private readonly kafkaFilter: KafkaHandler,
  ) {}

  public async publishMessage(topic: string, payload: string): Promise<void> {
    const kafkaPublishMessageOperation = () =>
      this.videosKafkaClient.producer.send({
        topic,
        messages: [{ key: 'videos', value: payload }],
      });

    await this.kafkaFilter.execute(kafkaPublishMessageOperation, {
      operationType: 'PUBLISH_OR_SEND',
      topic,
      message: String(payload),
    });
  }

  public async subscribeTo(topic: string): Promise<void> {
    const kafkaSubscribeOperation = () =>
      this.videosKafkaClient.consumer.subscribe({ topic, fromBeginning: true });
    await this.kafkaFilter.execute(kafkaSubscribeOperation, {
      operationType: 'SUBSCRIBE',
      topic,
    });
  }
}
