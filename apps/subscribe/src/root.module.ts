import { Module } from '@nestjs/common';

import { MeasureModule } from './infrastructure/measure';
import { SubscribeConfigModule } from './infrastructure/config';

@Module({
  imports: [SubscribeConfigModule, MeasureModule],
})
export class RootModule {}
