import { z } from 'zod';

import { InvalidLanguaugePreferenceException } from '@users/domain/exceptions';

export class UserLanguagePreference {
  private static UserLanguagePreferenceValidationSchema = z
    .enum(['en', 'hn', 'fr'])
    .optional()
    .default('en');

  public constructor(private readonly value: string) {}

  public static create(value?: string) {
    if (!value) {
      value = 'en';
    }

    const parsedDateResult =
      UserLanguagePreference.UserLanguagePreferenceValidationSchema.safeParse(
        value,
      );
    if (!parsedDateResult.success) {
      const errorMessage = parsedDateResult.error.message;
      throw new InvalidLanguaugePreferenceException({
        message: `Language validation failed. Reason: ${errorMessage}`,
      });
    }
    return new UserLanguagePreference(parsedDateResult.data);
  }

  public getValue() {
    return this.value;
  }
}
