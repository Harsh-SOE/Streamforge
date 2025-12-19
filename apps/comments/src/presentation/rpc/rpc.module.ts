import { Module } from '@nestjs/common';

import { CommentEventHandler } from '@comments/application/events';
import { CommentCommandHandler } from '@comments/application/use-cases';

import { GrpcService } from './rpc.service';
import { GrpcController } from './rpc.controller';
import { FrameworkModule } from '@comments/infrastructure/framework/framework.module';

@Module({
  imports: [FrameworkModule],
  controllers: [GrpcController],
  providers: [GrpcService, ...CommentCommandHandler, ...CommentEventHandler],
})
export class GrpcModule {}
