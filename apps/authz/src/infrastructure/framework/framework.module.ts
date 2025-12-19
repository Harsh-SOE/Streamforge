import { Global, Module } from '@nestjs/common';

import { LOGGER_PORT } from '@app/ports/logger';
import { AUTHORIZE_PORT } from '@authz/application/ports/auth';

import { AppConfigService } from '../config';
import { WinstonLoggerAdapter } from '../logger';
import { OpenFGAAuthAdapter } from '../auth/adapters';

@Global()
@Module({
  imports: [],
  providers: [
    AppConfigService,
    { provide: AUTHORIZE_PORT, useClass: OpenFGAAuthAdapter },
    { provide: LOGGER_PORT, useClass: WinstonLoggerAdapter },
  ],
  exports: [AppConfigService, AUTHORIZE_PORT, LOGGER_PORT],
})
export class FrameworkModule {}
