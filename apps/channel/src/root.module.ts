import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { RpcModule } from './presentation/rpc';
import { MeasureModule } from './infrastructure/measure';
import { ChannelConfigModule } from './infrastructure/config';

@Module({
  imports: [ChannelConfigModule, RpcModule, MeasureModule, ScheduleModule.forRoot()],
})
export class RootModule {}
