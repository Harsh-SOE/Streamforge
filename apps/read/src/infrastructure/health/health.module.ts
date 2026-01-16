import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';

import { AppHealthService } from './health.service';
import { AppHealthController } from './health.controller';

import { ReadConfigModule } from '../config';

@Module({
  imports: [TerminusModule, ReadConfigModule],
  controllers: [AppHealthController],
  providers: [AppHealthService],
})
export class AppHealthModule {}
