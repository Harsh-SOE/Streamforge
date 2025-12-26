import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { MeasureModule } from './infrastructure/measure';
import { RpcModule } from './presentation/rpc/rpc.module';
import { ViewsConfigModule } from './infrastructure/config';

@Module({
  imports: [RpcModule, MeasureModule, ViewsConfigModule, ScheduleModule.forRoot()],
})
export class RootModule {}
