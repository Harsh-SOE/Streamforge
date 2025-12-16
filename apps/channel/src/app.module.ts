import { Module } from '@nestjs/common';

import { AppConfigModule } from './infrastructure/config';
import { RpcModule } from './presentation/rpc';
import { MeasureModule } from './infrastructure/measure';

@Module({
  imports: [AppConfigModule, RpcModule, MeasureModule],
})
export class AppModule {}
