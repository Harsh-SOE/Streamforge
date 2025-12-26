import { Module } from '@nestjs/common';

import { LOGGER_PORT } from '@app/ports/logger';
import { LOKI_URL, LokiConsoleLogger } from '@app/utils/loki-console-logger';

import { EMAIL_PORT } from '@email/application/ports';
import { MeasureModule } from '@email/infrastructure/measure';
import { MailerSendEmailAdapter } from '@email/infrastructure/email';
import { EmailConfigModule, EmailConfigService } from '@email/infrastructure/config';

@Module({
  imports: [EmailConfigModule, MeasureModule],
  providers: [
    {
      provide: LOKI_URL,
      inject: [EmailConfigService],
      useFactory: (configService: EmailConfigService) => configService.GRAFANA_LOKI_URL,
    },
    { provide: LOGGER_PORT, useClass: LokiConsoleLogger },
    { provide: EMAIL_PORT, useClass: MailerSendEmailAdapter },
    EmailConfigService,
  ],
  exports: [LOGGER_PORT, EMAIL_PORT, EmailConfigService],
})
export class KakfaModule {}
