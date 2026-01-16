import { makeCounterProvider } from '@willsoto/nestjs-prometheus';

export const readServiceRequestsCounter = makeCounterProvider({
  name: 'total_requests_for_read',
  help: 'This metric will provide the total request recieved by the read service',
  labelNames: ['method', 'route', 'status_code'],
});
