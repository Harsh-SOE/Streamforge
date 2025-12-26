import { Module } from '@nestjs/common';

import { MeasureModule } from './infrastructure/measure';
import { AuthzConfigModule } from './infrastructure/config';
import { RpcModule } from './presentation/rpc/rpc.module';

@Module({
  imports: [AuthzConfigModule, RpcModule, MeasureModule],
  controllers: [],
  providers: [],
})
export class RootModule {}
