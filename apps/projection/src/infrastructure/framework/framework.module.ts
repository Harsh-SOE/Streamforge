import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { LOGGER_PORT } from '@app/ports/logger';
// import { KafkaMessageBrokerHandler } from '@app/handlers/message-broker-handler';

import {
  CHANNEL_PROJECTION_REPOSITORY_PORT,
  USER_PROJECTION_REPOSITORY_PORT,
  // PROJECTION_BUFFER_PORT,
  VIDEO_PROJECTION_REPOSITORY_PORT,
} from '@projection/application/ports';

import {
  ChannelProjectionRepository,
  UserProjectionRepository,
  VideoProjectionRepository,
} from '../repository/adapters';
import { AppConfigModule, AppConfigService } from '../config';
import { WinstonLoggerAdapter } from '../logger';
// import { KafkaBufferAdapter } from '../buffer/adapters';
import { ChannelProjectionACL, UserProjectionACL, VideoProjectionACL } from '../anti-corruption';
import {
  ChannelProjectionModel,
  ChannelProjectionSchema,
  UserProjectionModel,
  VideoProjectionModel,
  VideoProjectionSchema,
  UserProjectionSchema,
} from '../repository/models';
// import { ProjectionKafkaClient } from '../clients/kafka';

@Global()
@Module({
  imports: [
    AppConfigModule,
    MongooseModule.forRootAsync({
      imports: [AppConfigModule],
      inject: [AppConfigService],
      useFactory: (configService: AppConfigService) => ({
        uri: configService.DATABASE_URL,
      }),
    }),
    MongooseModule.forFeature([
      {
        name: VideoProjectionModel.name,
        schema: VideoProjectionSchema,
      },
      {
        name: UserProjectionModel.name,
        schema: UserProjectionSchema,
      },
      {
        name: ChannelProjectionModel.name,
        schema: ChannelProjectionSchema,
      },
    ]),
  ],
  providers: [
    AppConfigService,
    VideoProjectionACL,
    ChannelProjectionACL,
    UserProjectionACL,
    // ProjectionKafkaClient,
    // KafkaMessageBrokerHandler,
    // {
    //   provide: PROJECTION_BUFFER_PORT,
    //   useClass: KafkaBufferAdapter,
    // },
    {
      provide: LOGGER_PORT,
      useClass: WinstonLoggerAdapter,
    },
    {
      provide: VIDEO_PROJECTION_REPOSITORY_PORT,
      useClass: VideoProjectionRepository,
    },
    {
      provide: USER_PROJECTION_REPOSITORY_PORT,
      useClass: UserProjectionRepository,
    },
    {
      provide: CHANNEL_PROJECTION_REPOSITORY_PORT,
      useClass: ChannelProjectionRepository,
    },
  ],
  exports: [
    AppConfigService,
    VideoProjectionACL,
    ChannelProjectionACL,
    UserProjectionACL,
    // ProjectionKafkaClient,
    // KafkaMessageBrokerHandler,
    LOGGER_PORT,
    VIDEO_PROJECTION_REPOSITORY_PORT,
    USER_PROJECTION_REPOSITORY_PORT,
    // PROJECTION_BUFFER_PORT,
    CHANNEL_PROJECTION_REPOSITORY_PORT,
  ],
})
export class FrameworkModule {}
