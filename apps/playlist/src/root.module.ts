import { Module } from '@nestjs/common';
import { PlaylistConfigModule } from './infrastructure/config';
import { MeasureModule } from './infrastructure/measure';

@Module({
  imports: [PlaylistConfigModule, MeasureModule],
})
export class RootModule {}
