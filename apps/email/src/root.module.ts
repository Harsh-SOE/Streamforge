import { Module } from '@nestjs/common';

import { KafkaService } from './presentation/messages/messages.service';
import { KafkaController } from './presentation/messages/messages.controller';
import { KakfaModule } from './presentation/messages/messages.module';
import { EmailConfigModule } from './infrastructure/config/config.module';
import { MeasureModule } from './infrastructure/measure';
import { AppHealthModule } from './infrastructure/health';

@Module({
  imports: [KakfaModule, EmailConfigModule, MeasureModule, AppHealthModule],
  providers: [KafkaService],
  controllers: [KafkaController],
})
export class RootModule {}
