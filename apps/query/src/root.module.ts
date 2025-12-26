import { Module } from '@nestjs/common';

import { QueryConfigModule } from './infrastructure/config';
import { MeasureModule } from './infrastructure/measure';
import { RpcModule } from './presentation/rpc/rpc.module';

@Module({
  imports: [QueryConfigModule, RpcModule, MeasureModule],
})
export class RootModule {}
