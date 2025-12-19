import { Module } from '@nestjs/common';

import { GrpcService } from './grpc.service';
import { GrpcController } from './grpc.controller';
import { FrameworkModule } from '../../infrastructure/framework';

@Module({
  imports: [FrameworkModule],
  controllers: [GrpcController],
  providers: [GrpcService],
})
export class GrpcModule {}
