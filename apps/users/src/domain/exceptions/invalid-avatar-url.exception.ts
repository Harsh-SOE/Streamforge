import { DomainException } from './domain.exception';

export interface InvalidAvatarUrlExceptionOptions {
  message?: string;
  meta?: Record<string, any>;
}

export class InvalidAvatarUrlException extends DomainException {
  public constructor(options: InvalidAvatarUrlExceptionOptions) {
    const { message = `Invalid avatarUrl status was received`, meta } =
      options || {};
    super({
      code: 'INVALID_INPUT_EXCEPTION',
      message: message,
      meta,
    });
  }
}
