import { DomainException } from './domain.exception';

export interface InvalidUserIdOptions {
  message?: string;
  meta?: Record<string, any>;
}

export class InvalidIdException extends DomainException {
  public constructor(options: InvalidUserIdOptions) {
    const { message = `Invalid id was received`, meta } = options || {};
    super({
      code: 'INVALID_INPUT_EXCEPTION',
      message: message,
      meta,
    });
  }
}
