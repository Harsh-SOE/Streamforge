import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { EventHandler } from '@projection/application/events/handlers';
import { FrameworkModule } from '@projection/infrastructure/framework/framework.module';

import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';

@Module({
  imports: [CqrsModule, FrameworkModule],
  providers: [MessagesService, ...EventHandler],
  controllers: [MessagesController],
})
export class MessagesModule {}
