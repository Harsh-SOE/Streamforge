import { z } from 'zod';

import { InvalidEmailException } from '@users/domain/exceptions';

export class UserEmail {
  private static readonly UserEmailValidationSchema = z.email();

  public constructor(private readonly value: string) {}

  public static create(value: string) {
    value = value.trim();

    const parsedEmailResult =
      UserEmail.UserEmailValidationSchema.safeParse(value);
    if (!parsedEmailResult.success) {
      const errorMessage = parsedEmailResult.error.message;
      throw new InvalidEmailException({
        message: `Email validation failed. Reason: ${errorMessage}`,
      });
    }
    return new UserEmail(parsedEmailResult.data);
  }

  getValue(): string {
    return this.value;
  }
}
