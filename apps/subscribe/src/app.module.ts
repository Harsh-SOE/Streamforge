import { Module } from '@nestjs/common';

import { MeasureModule } from './infrastructure/measure';
import { AppConfigModule } from './infrastructure/config';

@Module({
  imports: [AppConfigModule, MeasureModule],
})
export class AppModule {}
