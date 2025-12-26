import { Module } from '@nestjs/common';

import { GrpcController } from './rpc.controller';
import { GrpcService } from './rpc.service';
import { FrameworkModule } from '@views/infrastructure/framework/framework.module';

@Module({
  imports: [FrameworkModule],
  controllers: [GrpcController],
  providers: [GrpcService],
})
export class RpcModule {}
