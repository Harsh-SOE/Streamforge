import { DomainException } from './domain.exception';

export interface InvalidPhoneNumberExceptionOptions {
  message?: string;
  meta?: Record<string, any>;
}

export class InvalidPhoneNumberException extends DomainException {
  public constructor(options: InvalidPhoneNumberExceptionOptions) {
    const { message = `Invalid phone number was received`, meta } = options || {};
    super({
      code: 'INVALID_INPUT_EXCEPTION',
      message: message,
      meta,
    });
  }
}
