import { Module } from '@nestjs/common';

import { MeasureModule } from './infrastructure/measure';
import { RpcModule } from './presentation/rpc/rpc.module';
import { EventsModule } from './presentation/events/events.module';
import { AppHealthModule } from './infrastructure/health/health.module';
import { PlatformModule } from './infrastructure/platform/platform.module';

@Module({
  imports: [EventsModule, RpcModule, AppHealthModule, MeasureModule, PlatformModule],
})
export class RootModule {}
