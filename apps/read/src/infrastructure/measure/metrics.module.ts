import { Global, Module } from '@nestjs/common';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';

import { readServiceRequestsCounter } from './metrics/requests-counter';

@Global()
@Module({
  imports: [
    PrometheusModule.register({
      defaultMetrics: { enabled: true },
    }),
  ],
  providers: [readServiceRequestsCounter],
  exports: [readServiceRequestsCounter],
})
export class MeasureModule {}
