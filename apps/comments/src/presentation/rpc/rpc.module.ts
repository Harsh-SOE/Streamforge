import { Module } from '@nestjs/common';

import { CommentEventHandler } from '@comments/application/integration-events';
import { CommentCommandHandler } from '@comments/application/commands';

import { RpcService } from './rpc.service';
import { RpcController } from './rpc.controller';
import { FrameworkModule } from '@comments/infrastructure/framework/framework.module';

@Module({
  imports: [FrameworkModule],
  controllers: [RpcController],
  providers: [RpcService, ...CommentCommandHandler, ...CommentEventHandler],
})
export class RpcModule {}
