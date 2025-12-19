import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { RpcModule } from './presentation/rpc';
import { MeasureModule } from './infrastructure/measure';
import { AppConfigModule } from './infrastructure/config';

@Module({
  imports: [AppConfigModule, RpcModule, MeasureModule, ScheduleModule.forRoot()],
})
export class AppModule {}
