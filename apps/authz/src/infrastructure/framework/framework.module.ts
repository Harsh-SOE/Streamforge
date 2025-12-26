import { Global, Module } from '@nestjs/common';

import { LOGGER_PORT } from '@app/ports/logger';
import { AUTHORIZE_PORT } from '@authz/application/ports/auth';
import { LOKI_URL, LokiConsoleLogger } from '@app/utils/loki-console-logger';

import { AuthzConfigService } from '../config';
import { OpenFGAAuthAdapter } from '../auth/adapters';

@Global()
@Module({
  imports: [],
  providers: [
    {
      provide: LOKI_URL,
      inject: [AuthzConfigService],
      useFactory: (configService: AuthzConfigService) => configService.GRAFANA_LOKI_URL,
    },
    AuthzConfigService,
    { provide: AUTHORIZE_PORT, useClass: OpenFGAAuthAdapter },
    { provide: LOGGER_PORT, useClass: LokiConsoleLogger },
  ],
  exports: [AuthzConfigService, AUTHORIZE_PORT, LOGGER_PORT],
})
export class FrameworkModule {}
