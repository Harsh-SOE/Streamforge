import { z } from 'zod';

import { InvalidRegionException } from '@users/domain/exceptions';

export class UserRegion {
  private static UserRegionValidationSchema = z.string().optional().default('IN');

  public constructor(private readonly value: string) {}

  public static create(value?: string) {
    const parsedDateResult = UserRegion.UserRegionValidationSchema.safeParse(value);
    if (!parsedDateResult.success) {
      const errorMessage = parsedDateResult.error.message;
      throw new InvalidRegionException({
        message: `Region failed. Reason: ${errorMessage}`,
      });
    }
    return new UserRegion(parsedDateResult.data);
  }

  public getValue() {
    return this.value;
  }
}
