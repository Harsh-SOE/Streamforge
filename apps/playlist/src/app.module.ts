import { Module } from '@nestjs/common';
import { AppConfigModule } from './infrastructure/config';
import { MeasureModule } from './infrastructure/measure';

@Module({
  imports: [AppConfigModule, MeasureModule],
})
export class AppModule {}
