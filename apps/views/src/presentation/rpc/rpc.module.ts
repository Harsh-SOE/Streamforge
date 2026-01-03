import { Module } from '@nestjs/common';

import { platformModule } from '@views/infrastructure/platform/platform.module';

import { GrpcController } from './rpc.controller';
import { GrpcService } from './rpc.service';

@Module({
  imports: [platformModule],
  controllers: [GrpcController],
  providers: [GrpcService],
})
export class RpcModule {}
