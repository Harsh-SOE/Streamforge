import { Module } from '@nestjs/common';

import { LikeActionCommandHandler } from '@reaction/application/use-cases';
import { FrameworkModule } from '@reaction/infrastructure/framework/framework.module';

import { RpcController } from './rpc.controller';
import { RpcService } from './rpc.service';

@Module({
  imports: [FrameworkModule],
  controllers: [RpcController],
  providers: [...LikeActionCommandHandler, RpcService],
})
export class RpcModule {}
