import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { ChannelCommandHandlers } from '@channel/application/commands/handlers';
import { ChannelEventHandler } from '@channel/application/events/handlers';
import { FrameworkModule } from '@channel/infrastructure/framework/framework.module';

import { GrpcController } from './rpc.controller';
import { GrpcService } from './rpc.service';

@Module({
  imports: [CqrsModule, FrameworkModule],
  providers: [GrpcService, ...ChannelCommandHandlers, ...ChannelEventHandler],
  controllers: [GrpcController],
})
export class RpcModule {}
