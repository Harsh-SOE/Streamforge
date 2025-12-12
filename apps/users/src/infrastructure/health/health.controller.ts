import { Controller } from '@nestjs/common';
import { Observable } from 'rxjs';

import {
  HealthCheckResponse,
  HealthCheckResponse_ServingStatus,
  HealthController,
  HealthControllerMethods,
} from '@app/contracts/health';

@Controller()
@HealthControllerMethods()
export class AppHealthController implements HealthController {
  check():
    | Promise<HealthCheckResponse>
    | Observable<HealthCheckResponse>
    | HealthCheckResponse {
    return { status: HealthCheckResponse_ServingStatus.SERVING };
  }
}
