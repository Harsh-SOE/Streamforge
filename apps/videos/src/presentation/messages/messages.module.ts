import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { VideoEventHandler } from '@videos/application/events';
import { VideosConfigModule } from '@videos/infrastructure/config';

import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';

@Module({
  imports: [CqrsModule, VideosConfigModule],
  controllers: [MessagesController],
  providers: [MessagesService, ...VideoEventHandler],
})
export class MessagesModule {}
