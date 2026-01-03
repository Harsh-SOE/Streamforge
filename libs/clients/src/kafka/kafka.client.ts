import { Inject, Injectable } from '@nestjs/common';
import { Consumer, ConsumerConfig, Kafka, Producer, ProducerConfig } from 'kafkajs';

export const KAFKA_HOST = Symbol('KAFKA_HOST');
export const KAFKA_PORT = Symbol('KAFKA_PORT');
export const KAFKA_ACCESS_KEY = Symbol('KAFKA_ACCESS_KEY');
export const KAFKA_ACCESS_CERT = Symbol('KAFKA_ACCESS_CERT');
export const KAFKA_CA_CERT = Symbol('KAFKA_CA_CERT');
export const KAFKA_CLIENT = Symbol('KAFKA_CLIENT');
export const KAFKA_CONSUMER = Symbol('KAFKA_CONSUMER');

@Injectable()
export class KafkaClient {
  private client: Kafka;

  public constructor(
    @Inject(KAFKA_HOST) private readonly host: string,
    @Inject(KAFKA_PORT) private readonly port: number,
    @Inject(KAFKA_CA_CERT) private readonly ca: string,
    @Inject(KAFKA_ACCESS_CERT) private readonly accessCert: string,
    @Inject(KAFKA_ACCESS_KEY) private readonly accessKey: string,
    @Inject(KAFKA_CLIENT) private readonly kafkaClient: string,
  ) {
    this.client = new Kafka({
      brokers: [`${this.host}:${this.port}`],
      clientId: this.kafkaClient,
      ssl: {
        rejectUnauthorized: true,
        ca: [this.ca],
        key: this.accessKey,
        cert: this.accessCert,
      },
    });
  }

  public getProducer(config?: ProducerConfig): Producer {
    return this.client.producer(config);
  }

  public getConsumer(config: ConsumerConfig): Consumer {
    return this.client.consumer(config);
  }

  public getAdmin() {
    return this.client.admin();
  }
}
