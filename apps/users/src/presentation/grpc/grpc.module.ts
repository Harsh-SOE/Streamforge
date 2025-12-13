import { CqrsModule } from '@nestjs/cqrs';
import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';

import { LOGGER_PORT } from '@app/ports/logger';
import { MESSAGE_BROKER } from '@app/ports/message-broker';
import { PrismaDatabaseHandler } from '@app/handlers/database-handler';
import { KafkaMessageBrokerHandler } from '@app/handlers/message-broker-handler';

import {
  USER_CACHE_PORT,
  USER_REROSITORY_PORT,
  USERS_STORAGE_PORT,
} from '@users/application/ports';
import {
  AppConfigModule,
  AppConfigService,
} from '@users/infrastructure/config';
import { UserCommandHandlers } from '@users/application/use-cases/commands';
import { UserEventHandlers } from '@users/application/events';
import { MeasureModule } from '@users/infrastructure/measure';
import { UserRepositoryAdapter } from '@users/infrastructure/repository/adapters';
import { UserAggregatePersistanceACL } from '@users/infrastructure/anti-corruption/aggregate-persistance-acl';
import { KafkaMessageBrokerAdapter } from '@users/infrastructure/message-broker/adapters';
import { WinstonLoggerAdapter } from '@users/infrastructure/logger';
import { AwsS3StorageAdapter } from '@users/infrastructure/storage/adapters';
import { RedisCacheAdapter } from '@users/infrastructure/cache/adapters';
import { UserPrismaClient } from '@users/infrastructure/repository/client';

import { GrpcService } from './grpc.service';
import { GrpcController } from './grpc.controller';

@Module({
  imports: [
    MeasureModule,
    CqrsModule,
    CacheModule.registerAsync({
      imports: [AppConfigModule],
      inject: [AppConfigService],
      isGlobal: true,
      useFactory: (configService: AppConfigService) => ({
        isGlobal: true,
        store: redisStore,
        host: configService.REDIS_HOST,
        port: configService.REDIS_PORT,
      }),
    }),
  ],
  controllers: [GrpcController],
  providers: [
    GrpcService,
    UserAggregatePersistanceACL,
    KafkaMessageBrokerHandler,
    PrismaDatabaseHandler,
    UserPrismaClient,
    {
      provide: USER_REROSITORY_PORT,
      useClass: UserRepositoryAdapter,
    },
    {
      provide: MESSAGE_BROKER,
      useClass: KafkaMessageBrokerAdapter,
    },
    {
      provide: USER_CACHE_PORT,
      useClass: RedisCacheAdapter,
    },
    { provide: LOGGER_PORT, useClass: WinstonLoggerAdapter },
    { provide: USERS_STORAGE_PORT, useClass: AwsS3StorageAdapter },
    ...UserCommandHandlers,
    ...UserEventHandlers,
  ],
})
export class GrpcModule {}
