import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { QueryHandlers } from '@query/queries/handlers';
import { FrameworkModule } from '@query/infrastructure/framework/framework.module';

import { RpcService } from './rpc.service';
import { RpcController } from './rpc.controller';

@Module({
  imports: [CqrsModule, FrameworkModule],
  providers: [...QueryHandlers, RpcService],
  controllers: [RpcController],
})
export class RpcModule {}
