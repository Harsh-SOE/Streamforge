import { z } from 'zod';

import { DomainThemePreference } from '@users/domain/enums';
import { InvalidThemePreferenceException } from '@users/domain/exceptions';

export class UserThemePreference {
  private static UserThemePreferenceValidationSchema = z
    .enum(DomainThemePreference)
    .optional()
    .default(DomainThemePreference.SYSTEM);

  public constructor(private readonly value: DomainThemePreference) {}

  public static create(value?: string) {
    const parsedDateResult =
      UserThemePreference.UserThemePreferenceValidationSchema.safeParse(value);
    if (!parsedDateResult.success) {
      const errorMessage = parsedDateResult.error.message;
      throw new InvalidThemePreferenceException({
        message: `Theme validation failed. Reason: ${errorMessage}`,
      });
    }
    return new UserThemePreference(parsedDateResult.data);
  }

  public getValue() {
    return this.value;
  }
}
