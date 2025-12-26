import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { RpcModule } from './presentation/rpc';
import { MeasureModule } from './infrastructure/measure';
import { ReactionConfigModule } from './infrastructure/config';

@Module({
  imports: [ReactionConfigModule, RpcModule, ScheduleModule.forRoot(), MeasureModule],
})
export class RootModule {}
