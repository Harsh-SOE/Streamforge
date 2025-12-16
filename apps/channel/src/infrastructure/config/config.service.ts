import { join } from 'path';
import * as grpc from '@grpc/grpc-js';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as protoLoader from '@grpc/proto-loader';
import { GrpcOptions, KafkaOptions, Transport } from '@nestjs/microservices';
import { HealthImplementation, protoPath as HealthCheckProto } from 'grpc-health-check';

import { CHANNEL_PACKAGE_NAME } from '@app/contracts/channel';

@Injectable()
export class AppConfigService {
  public constructor(private configService: ConfigService) {}

  get SERVICE_PORT() {
    return this.configService.getOrThrow<number>('SERVICE_PORT');
  }

  get HTTP_PORT() {
    return this.configService.getOrThrow<number>('HTTP_PORT');
  }

  get DATABASE_URL() {
    return this.configService.getOrThrow<string>('DATABASE_URL');
  }

  get BUFFER_CLIENT_ID() {
    return this.configService.getOrThrow<string>('BUFFER_CLIENT_ID');
  }

  get BUFFER_KAFKA_CONSUMER_ID() {
    return this.configService.getOrThrow<string>('BUFFER_KAFKA_CONSUMER_ID');
  }

  get BUFFER_FLUSH_MAX_WAIT_TIME_MS() {
    return this.configService.getOrThrow<number>('BUFFER_FLUSH_MAX_WAIT_TIME_MS');
  }

  get BUFFER_KEY() {
    return this.configService.getOrThrow<string>('BUFFER_KEY');
  }

  get BUFFER_GROUPNAME() {
    return this.configService.getOrThrow<string>('BUFFER_GROUPNAME');
  }

  get BUFFER_REDIS_CONSUMER_ID() {
    return this.configService.getOrThrow<string>('BUFFER_REDIS_CONSUMER_ID');
  }

  get CACHE_HOST() {
    return this.configService.getOrThrow<string>('CACHE_HOST');
  }

  get CACHE_PORT() {
    return this.configService.getOrThrow<number>('CACHE_PORT');
  }

  get SERVICE_OPTIONS(): GrpcOptions {
    return {
      transport: Transport.GRPC,
      options: {
        package: [CHANNEL_PACKAGE_NAME],
        protoPath: [join(__dirname, 'proto/channel.proto'), HealthCheckProto],
        url: `0.0.0.0:${this.SERVICE_PORT}`,
        onLoadPackageDefinition(
          pkg: protoLoader.PackageDefinition,
          server: Pick<grpc.Server, 'addService'>,
        ) {
          const healthImpl = new HealthImplementation({
            '': 'UNKNOWN',
          });

          healthImpl.addToServer(server);
          healthImpl.setStatus('', 'SERVING');
        },
      },
    };
  }

  get MESSAGE_BROKER_HOST() {
    return this.configService.getOrThrow<string>('MESSAGE_BROKER_HOST');
  }

  get MESSAGE_BROKER_PORT() {
    return this.configService.getOrThrow<number>('MESSAGE_BROKER_PORT');
  }

  get EMAIL_CLIENT_ID() {
    return this.configService.getOrThrow<string>('EMAIL_CLIENT_ID');
  }

  get EMAIL_CONSUMER_GROUP_ID() {
    return this.configService.getOrThrow<string>('EMAIL_CONSUMER_GROUP_ID');
  }

  get CHANNEL_CLIENT_ID() {
    return this.configService.getOrThrow<string>('CHANNEL_CLIENT_ID');
  }

  get CHANNEL_CONSUMER_ID() {
    return this.configService.getOrThrow<string>('CHANNEL_CONSUMER_ID');
  }

  get AWS_REGION() {
    return this.configService.getOrThrow<string>('AWS_REGION');
  }

  get AWS_ACCESS_KEY() {
    return this.configService.getOrThrow<string>('AWS_ACCESS_KEY');
  }

  get AWS_ACCESS_SECRET() {
    return this.configService.getOrThrow<string>('AWS_ACCESS_SECRET');
  }

  get AWS_BUCKET() {
    return this.configService.getOrThrow<string>('AWS_BUCKET');
  }

  get GRAFANA_LOKI_URL() {
    return this.configService.getOrThrow<string>('GRAFANA_LOKI_URL');
  }

  get KAFKA_OPTIONS(): KafkaOptions {
    return {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: this.EMAIL_CLIENT_ID,
          brokers: [`${this.MESSAGE_BROKER_HOST}:${this.MESSAGE_BROKER_PORT}`],
        },
        consumer: {
          groupId: this.EMAIL_CONSUMER_GROUP_ID,
        },
      },
    };
  }
}
