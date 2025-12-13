import { DomainException } from './domain.exception';

export interface InvalidHandleExceptionOptions {
  message?: string;
  meta?: Record<string, any>;
}

export class InvalidHandleException extends DomainException {
  public constructor(options: InvalidHandleExceptionOptions) {
    const { message = `Invalid handle status was received`, meta } = options || {};
    super({
      code: 'INVALID_INPUT_EXCEPTION',
      message: message,
      meta,
    });
  }
}
