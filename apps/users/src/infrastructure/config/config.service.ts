import { GrpcOptions, KafkaOptions, Transport } from '@nestjs/microservices';
import { ReflectionService } from '@grpc/reflection';
import * as protoLoader from '@grpc/proto-loader';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import * as grpc from '@grpc/grpc-js';
import { join } from 'path';

import { USER_PACKAGE_NAME } from '@app/contracts/users';
import { GRPC_HEALTH_V1_PACKAGE_NAME } from '@app/contracts/health';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  get HTTP_PORT() {
    return this.configService.getOrThrow<number>('HTTP_PORT');
  }

  get GRPC_PORT() {
    return this.configService.getOrThrow<number>('GRPC_PORT');
  }

  get GRAFANA_LOKI_URL() {
    return this.configService.getOrThrow<string>('GRAFANA_LOKI_URL');
  }

  get DATABASE_URL() {
    return this.configService.getOrThrow<string>('DATABASE_URL');
  }

  get USER_CLIENT_ID() {
    return this.configService.getOrThrow<string>('USER_CLIENT_ID');
  }

  get USER_CONSUMER_ID() {
    return this.configService.getOrThrow<string>('USER_CONSUMER_ID');
  }

  get MESSAGE_BROKER_PORT() {
    return this.configService.getOrThrow<number>('MESSAGE_BROKER_PORT');
  }

  get MESSAGE_BROKER_HOST() {
    return this.configService.getOrThrow<string>('MESSAGE_BROKER_HOST');
  }

  get WATCH_SERVICE_OPTIONS() {
    const options: KafkaOptions = {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: [`${this.MESSAGE_BROKER_HOST}:${this.MESSAGE_BROKER_PORT}`],
          clientId: this.USER_CLIENT_ID,
        },
        consumer: {
          groupId: this.USER_CONSUMER_ID,
        },
      },
    };
    return options;
  }

  get MAX_DB_CONNECTIONS() {
    return this.configService.getOrThrow<number>('MAX_DB_CONNECTIONS');
  }

  get MIN_DB_CONNECTIONS() {
    return this.configService.getOrThrow<number>('MIN_DB_CONNECTIONS');
  }

  get DB_IDLE_CONNECTION_TIMEOUT() {
    return this.configService.getOrThrow<number>('DB_IDLE_CONNECTION_TIMEOUT');
  }

  get DB_QUERY_CONNECTION_TIMEOUT() {
    return this.configService.getOrThrow<number>('DB_QUERY_CONNECTION_TIMEOUT');
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

  get REDIS_HOST() {
    return this.configService.getOrThrow<string>('REDIS_HOST');
  }

  get REDIS_PORT() {
    return this.configService.getOrThrow<number>('REDIS_PORT');
  }

  get GRPC_OPTIONS(): GrpcOptions {
    const options: GrpcOptions = {
      transport: Transport.GRPC,
      options: {
        protoPath: [
          join(__dirname, 'proto/users.proto'),
          join(__dirname, 'proto/health.proto'),
        ],
        package: [USER_PACKAGE_NAME, GRPC_HEALTH_V1_PACKAGE_NAME],
        url: `0.0.0.0:${this.GRPC_PORT}`,
        onLoadPackageDefinition(
          pkg: protoLoader.PackageDefinition,
          server: Pick<grpc.Server, 'addService'>,
        ) {
          new ReflectionService(pkg).addToServer(server);
        },
      },
    };
    return options;
  }
}
