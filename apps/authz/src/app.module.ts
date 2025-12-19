import { Module } from '@nestjs/common';

import { MeasureModule } from './infrastructure/measure';
import { AppConfigModule } from './infrastructure/config';
import { RpcModule } from './presentation/rpc/rpc.module';

@Module({
  imports: [AppConfigModule, RpcModule, MeasureModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
