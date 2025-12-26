import {
  InfrastructureOperationFailureLevel,
  MESSAGE_BUS_EXCEPTION,
  InfrastructureException,
} from '../infrastructure-exceptions';

export type MessageBusTimeoutExceptionMetadata = {
  host?: string;
  port?: number;
  retryAttempt?: number;
  topic?: string;
  message?: string;
};

export type MessageBusTimeoutExceptionOptions = {
  message: string;
  contextError?: Error;
  operation?: string;
  meta?: MessageBusTimeoutExceptionMetadata;
};

export class MessageBusTimeoutException extends InfrastructureException {
  constructor(options: MessageBusTimeoutExceptionOptions) {
    const { message, contextError, operation, meta } = options;
    super({
      message,
      code: MESSAGE_BUS_EXCEPTION.MESSAGE_BUS_TIMEOUT_EXCEPTION,
      component: 'MESSAGE_BUS',
      operation,
      severity: InfrastructureOperationFailureLevel.ERROR,
      contextError,
      meta,
    });
  }
}
