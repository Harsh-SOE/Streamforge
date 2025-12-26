import {
  InfrastructureException,
  InfrastructureOperationFailureLevel,
  MESSAGE_BUS_EXCEPTION,
} from '../infrastructure-exceptions';

export type MessageBusConnectionExceptionMetadata = {
  host?: string;
  port?: number;
  retryAttempt?: number;
};

export type MessageBusConnectionExceptionOptions = {
  message?: string;
  meta?: MessageBusConnectionExceptionMetadata;
  contextError?: Error;
};

export class MessageBusConnectionException extends InfrastructureException {
  constructor(options: MessageBusConnectionExceptionOptions) {
    const { message = 'Unable to connect to message bus', contextError, meta } = options;
    super({
      message,
      code: MESSAGE_BUS_EXCEPTION.MESSAGE_BUS_CONNECTION_EXCEPTION,
      component: 'MESSAGE_BUS',
      operation: 'Connection',
      severity: InfrastructureOperationFailureLevel.FATAL,
      meta,
      contextError,
    });
  }
}
