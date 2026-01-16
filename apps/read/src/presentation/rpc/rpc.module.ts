import { Module } from '@nestjs/common';

import { QueryHandlers } from '@read/application/queries';

import { RpcService } from './rpc.service';
import { RpcController } from './rpc.controller';

@Module({
  providers: [...QueryHandlers, RpcService],
  controllers: [RpcController],
})
export class RpcModule {}
