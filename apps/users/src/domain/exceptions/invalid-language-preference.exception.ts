import { DomainException } from './domain.exception';

export interface InvalidLanguaugePreferenceExceptionOptions {
  message?: string;
  meta?: Record<string, any>;
}

export class InvalidLanguaugePreferenceException extends DomainException {
  public constructor(options: InvalidLanguaugePreferenceExceptionOptions) {
    const { message = `Invalid Languauge preference was received`, meta } = options || {};
    super({
      code: 'INVALID_INPUT_EXCEPTION',
      message: message,
      meta,
    });
  }
}
