import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { ChannelCommandHandlers } from '@channel/application/commands/handlers';
import { ChannelEventHandler } from '@channel/application/events/handlers';
import { FrameworkModule } from '@channel/infrastructure/framework/framework.module';

import { RpcController } from './rpc.controller';
import { RpcService } from './rpc.service';

@Module({
  imports: [CqrsModule, FrameworkModule],
  providers: [RpcService, ...ChannelCommandHandlers, ...ChannelEventHandler],
  controllers: [RpcController],
})
export class RpcModule {}
