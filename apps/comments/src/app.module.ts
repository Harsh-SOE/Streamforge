import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { AppConfigModule } from './infrastructure/config';

import { GrpcModule } from './presentation/rpc';
import { MeasureModule } from './infrastructure/measure';

@Module({
  imports: [AppConfigModule, GrpcModule, ScheduleModule.forRoot(), MeasureModule],
})
export class AppModule {}
