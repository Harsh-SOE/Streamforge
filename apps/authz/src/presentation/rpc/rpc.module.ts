import { Module } from '@nestjs/common';

import { FrameworkModule } from '@authz/infrastructure/framework/framework.module';

import { RpcService } from './rpc.service';
import { RpcController } from './rpc.controller';

@Module({
  imports: [FrameworkModule],
  providers: [RpcService],
  controllers: [RpcController],
})
export class RpcModule {}
