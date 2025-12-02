import { CqrsModule } from '@nestjs/cqrs';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { LOGGER_PORT } from '@app/ports/logger';

import {
  ProjectedVideoCardModel,
  ProjectUserCardSchema,
} from '@projection/infrastructure/repository/models';
import {
  PROJECTION_BUFFER_PORT,
  PROJECTION_REPOSITORY_PORT,
} from '@projection/application/ports';
import { WinstonLoggerAdapter } from '@projection/infrastructure/logger';
import { KafkaBufferAdapter } from '@projection/infrastructure/buffer/adapters';
import { VideoCardRepository } from '@projection/infrastructure/repository/adapters';
import { VideoCardACL } from '@projection/infrastructure/anti-corruption';

import { KafkaService } from './kafka.service';
import { KafkaController } from './kafka.controller';

@Module({
  imports: [
    CqrsModule,
    MongooseModule.forFeature([
      {
        name: ProjectedVideoCardModel.name,
        schema: ProjectUserCardSchema,
      },
    ]),
  ],
  providers: [
    KafkaService,
    VideoCardACL,
    {
      provide: PROJECTION_BUFFER_PORT,
      useClass: KafkaBufferAdapter,
    },
    {
      provide: LOGGER_PORT,
      useClass: WinstonLoggerAdapter,
    },
    {
      provide: PROJECTION_REPOSITORY_PORT,
      useClass: VideoCardRepository,
    },
  ],
  controllers: [KafkaController],
})
export class KafkaModule {}
