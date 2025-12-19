import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { AppConfigModule } from './infrastructure/config';
import { GrpcModule } from './presentation/rpc/rpc.module';
import { MeasureModule } from './infrastructure/measure';

@Module({
  imports: [GrpcModule, MeasureModule, AppConfigModule, ScheduleModule.forRoot()],
})
export class AppModule {}
