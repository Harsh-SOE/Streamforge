import { Module } from '@nestjs/common';

import { MeasureModule } from './infrastructure/measure';
import { HistoryConfigModule } from './infrastructure/config';

@Module({
  imports: [HistoryConfigModule, MeasureModule],
})
export class RootModule {}
