import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { RpcModule } from './presentation/rpc';
import { MessagesModule } from './presentation/messages';
import { PlatformModule } from './infrastructure/platform/platform.module';

@Module({
  imports: [ScheduleModule.forRoot(), RpcModule, MessagesModule, PlatformModule],
})
export class RootModule {}
