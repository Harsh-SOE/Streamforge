import { Module } from '@nestjs/common';

import { MeasureModule } from '@users/infrastructure/measure';
import { AppConfigModule } from '@users/infrastructure/config';

import { GrpcModule } from './presentation/grpc';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [GrpcModule, MeasureModule, AppConfigModule, ScheduleModule.forRoot()],
})
export class AppModule {}
