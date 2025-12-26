import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { CommentsConfigModule } from './infrastructure/config';

import { RpcModule } from './presentation/rpc';
import { MeasureModule } from './infrastructure/measure';

@Module({
  imports: [CommentsConfigModule, RpcModule, ScheduleModule.forRoot(), MeasureModule],
})
export class RootModule {}
