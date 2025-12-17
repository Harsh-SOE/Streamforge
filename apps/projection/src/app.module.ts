import { Module } from '@nestjs/common';

import { MessagesModule } from './presentation/messages/messages.module';
import { AppHealthModule } from './infrastructure/health/health.module';
import { MeasureModule } from './infrastructure/measure';

@Module({
  imports: [MessagesModule, AppHealthModule, MeasureModule],
})
export class AppModule {}
