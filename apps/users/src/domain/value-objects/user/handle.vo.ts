import { z } from 'zod';

import { InvalidHandleException } from '@users/domain/exceptions';

export class UserHandle {
  private static UserHandleValidationSchema = z
    .string()
    .trim()
    .min(5, 'Handle should have atleast 5 characters')
    .max(12, 'Handle cannot have more than 12 characters')
    .regex(
      /^[a-zA-Z][a-zA-Z0-9_]*$/,
      'Handle must start with a letter and can only contain letters, numbers, and underscores',
    );

  public constructor(private readonly value: string) {}

  public static create(value: string) {
    const parsedUrlResult = UserHandle.UserHandleValidationSchema.safeParse(value);
    if (!parsedUrlResult.success) {
      const errorMessage = parsedUrlResult.error.message;
      throw new InvalidHandleException({
        message: `Handle validation failed. Reason: ${errorMessage}`,
      });
    }
    return new UserHandle(parsedUrlResult.data);
  }

  public getValue() {
    return this.value;
  }
}
