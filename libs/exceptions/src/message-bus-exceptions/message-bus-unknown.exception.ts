import {
  InfrastructureOperationFailureLevel,
  MESSAGE_BUS_EXCEPTION,
  InfrastructureException,
} from '../infrastructure-exceptions';

export type MessageBusUnknownExceptionMetadata = {
  host?: string;
  port?: number;
  retryAttempt?: number;
  topic?: string;
  message?: string;
};

export type MessageBusUnknownExceptionOptions = {
  message?: string;
  contextError?: Error;
  operation?: string;
  meta?: MessageBusUnknownExceptionMetadata;
};

export class MessageBusUnknownException extends InfrastructureException {
  constructor(options: MessageBusUnknownExceptionOptions) {
    const { message = 'An error occured in message bus', meta, contextError, operation } = options;
    super({
      message,
      code: MESSAGE_BUS_EXCEPTION.MESSAGE_BUS_UNKNOWN_EXCEPTION,
      contextError,
      meta,
      component: 'MESSAGE_BUS',
      operation,
      severity: InfrastructureOperationFailureLevel.ERROR,
    });
  }
}
