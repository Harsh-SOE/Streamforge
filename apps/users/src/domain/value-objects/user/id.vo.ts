import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';

import { InvalidIdException } from '@users/domain/exceptions';

export class UserId {
  private static readonly UserIdValidationSchema = z.uuidv4();

  public constructor(private readonly value: string) {}

  public static create(value?: string) {
    value = value?.trim();

    if (!value) {
      value = uuidv4();
    }

    const parsedIdResult = UserId.UserIdValidationSchema.safeParse(value);
    if (!parsedIdResult.success) {
      const errorMessage = parsedIdResult.error.message;
      throw new InvalidIdException({
        message: `Id validation failed. Reason: ${errorMessage}`,
      });
    }
    return new UserId(parsedIdResult.data);
  }

  getValue(): string {
    return this.value;
  }
}
