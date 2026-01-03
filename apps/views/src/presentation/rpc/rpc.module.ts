import { Module } from '@nestjs/common';

import { FrameworkModule } from '@views/infrastructure/framework/framework.module';

import { GrpcController } from './rpc.controller';
import { GrpcService } from './rpc.service';

@Module({
  imports: [FrameworkModule],
  controllers: [GrpcController],
  providers: [GrpcService],
})
export class RpcModule {}
